const superagent = require('superagent')
const immutable = require('immutable')
const apikey = require('../config').OCTOPART_API_KEY

const retailer_map = immutable.OrderedMap({
  'Digi-Key'       : 'Digikey',
  'Mouser'         : 'Mouser',
  'RS Components'  : 'RS',
  'Newark'         : 'Newark',
  'element14 APAC' : 'Farnell',
  'Farnell'        : 'Farnell',
})

const retailer_reverse_map = retailer_map.mapEntries(([k,v]) => [v, k])
const retailers_used       = immutable.Set.fromKeys(retailer_map)

function transform(queries) {
  return queries.map(q => {
    const ret = {}
    if (q.get('mpn')) {
       ret.mpn = q.getIn(['mpn', 'part'])
       //octopart has some issue with the slash
       ret.brand = q.getIn(['mpn', 'manufacturer']).replace(' / ', ' ')
    }
    if (q.get('sku')) {
      ret.sku = q.getIn(['sku', 'part'])
      ret.seller = retailer_reverse_map.get(q.getIn(['sku', 'vendor']))
    }
    ret.reference = String(q.hashCode())
    return ret
  })
}

function octopart(queries) {
  const octopart_queries = transform(queries)
  return superagent.get('https://octopart.com/api/v3/parts/match')
    .query('include[]=specs&include[]=short_description&include[]=imagesets&include[]=datasheets')
    .query({
      apikey,
      queries: JSON.stringify(octopart_queries.toJS()),
    })
    .set('Accept', 'application/json')
    .then(res => {
      if (res.status !== 200) {
        console.error(res.status, queries)
      }
      const results = res.body.results
      return queries.reduce((returns, query) => {
        const query_id = String(query.hashCode())
        const result = results.find(r => r.reference === query_id)
        if (result == null) {
          return returns.set(query, immutable.Map())
        }
        if (result.items.length === 0) {
          return returns.set(query, immutable.Map())
        }
        const item = result.items[0]
        const specs = immutable.Map(item.specs).map((spec, key) => {
          return immutable.Map({
            key,
            name: spec.metadata.name,
            value: spec.display_value,
          })
        }).toList()
        const number = query.getIn(['mpn', 'part']) || item.mpn
        const manufacturer = query.getIn(['mpn', 'manufacturer']) || item.brand.name
        return returns.set(query, immutable.Map({
            mpn: immutable.Map({
              part: number,
              manufacturer,
            }),
            description  : item.short_description,
            image        : image(item),
            datasheet    : datasheet(item),
            offers       : offers(item),
            specs
        }))
      }, immutable.Map())
    }).catch(err => console.error(err))
}


function image(item) {
  return item.imagesets.reduce((prev, set) => {
    if (prev != null) {
      return prev
    }
    if (set.medium_image && set.medium_image.url) {
      return immutable.Map({
        url           : set.medium_image.url,
        credit_string : set.credit_string,
        credit_url    : set.credit_url
      })
    }
    return null
  }, null)
}

function datasheet(item) {
  return item.datasheets.reduce((prev, d) => prev || d.url, null)
}


function offers(item) {
  const offers = immutable.Set(item.offers)
    .filter(o => retailers_used.includes(o.seller.name))
    .map(offer => {
      return immutable.fromJS({
        sku: {
          part : offer.sku,
          vendor : retailer_map.get(offer.seller.name),
        },
        prices: offer.prices
      })
    })
  return mergeOffers(offers)
}

function mergeOffers(offers) {
  return offers.reduce((offers, offer) => {
    const sku = offer.get('sku')
    const existing_offer = offers.find(o => o.get('sku').equals(sku))
    if (existing_offer) {
      offers = offers.delete(existing_offer)
      offer = existing_offer.update('prices', ps => ps.concat(offer.get('prices')))
    }
    return offers.add(offer)
  }, immutable.Set())
}



module.exports = octopart
