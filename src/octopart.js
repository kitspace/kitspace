const superagent = require('superagent')
const immutable = require('immutable')
const apikey = require('./secrets').OCTOPART_API_KEY

const aliases = immutable.Map({
  query_id: 'reference',
  manufacturer: 'brand',
  mpn: 'mpn',
  vendor: 'seller',
  sku: 'sku',
})

function transform(queries) {
  return queries.map(q => {
    const ret = {}
    if (q.get('mpn')) {
       ret.mpn = q.get('mpn').get('number')
       ret.brand = q.get('mpn').get('manufacturer')
    }
    if (q.get('sku')) {
      ret.sku = q.get('sku').get('number')
      ret.seller = q.get('sku').get('vendor')
    }
    ret.reference = String(q.hashCode())
    return ret
  })
}

function octopart(queries) {
  const octopart_queries = transform(queries)
  return superagent.get('https://octopart.com/api/v3/parts/match')
    .query('include[]=short_description&include[]=imagesets&include[]=datasheets')
    .query({
      apikey,
      queries: JSON.stringify(octopart_queries.toJS()),
    })
    .set('Accept', 'application/json')
    .then(res => {
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
        return returns.set(query, immutable.Map({
            mpn: immutable.Map({
              number       : item.mpn,
              manufacturer : item.brand.name,
            }),
            description  : item.short_description,
            image        : image(item),
            datasheet    : datasheet(item),
            offers       : offers(item),
        }))
      }, immutable.Map())
    })
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
  return immutable.List(item.offers).map(offer => {
    return immutable.Map({
      sku: immutable.Map({
        number : offer.sku,
        vendor : offer.seller.name,
      }),
      prices: immutable.fromJS(offer.prices)
    })
  })
}


module.exports = octopart
