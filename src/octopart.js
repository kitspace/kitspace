const superagent = require('superagent')
const immutable = require('immutable')
const apikey = require('../config').OCTOPART_API_KEY

function transform(queries) {
  return queries.map(q => {
    const ret = {}
    if (q.get('mpn')) {
       ret.mpn = q.get('mpn').get('part')
       //octopart has some issue with the slash
       ret.brand = q.get('mpn').get('manufacturer').replace(' / ', ' ')
    }
    if (q.get('sku')) {
      ret.sku = q.get('sku').get('part')
      ret.seller = q.get('sku').get('vendor')
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
        const number = query.get('mpn') ? query.get('mpn').get('part') : item.mpn
        let manufacturer = item.brand.name
        if (query.get('mpn') && query.get('mpn').get('manufacturer') !== '') {
          manufacturer = query.get('mpn').get('manufacturer')
        }
        return returns.set(query, immutable.Map({
            mpn: immutable.Map({
              part : number,
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

const retailers_used = immutable.List.of('Digi-Key', 'RS Components', 'Farnell', 'element14 APAC', 'Mouser')

function offers(item) {
  return immutable.List(item.offers)
    .filter(o => retailers_used.includes(o.seller.name))
    .map(offer => {
      return immutable.Map({
        sku: immutable.Map({
          part : offer.sku,
          vendor : offer.seller.name,
        }),
        prices: immutable.fromJS(offer.prices)
      })
    })
}


module.exports = octopart
