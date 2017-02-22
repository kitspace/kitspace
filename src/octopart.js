const superagent = require('superagent')
const immutable = require('immutable')
const apikey = require('./secrets').OCTOPART_API_KEY

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


const aliases = immutable.Map({
  query_id: 'reference',
  manufacturer: 'brand',
  mpn: 'mpn',
})

function octopart(queries) {
  const octopart_queries = queries.map(q => {
    return q.reduce((prev, v, k) => {
      if (aliases.get(k)) {
        return prev.set(aliases.get(k), v)
      }
      return prev
    }, immutable.Map())
  })
  return superagent.get('https://octopart.com/api/v3/parts/match')
    .query('include[]=short_description&include[]=imagesets&include[]=datasheets')
    .query({
      apikey,
      queries: JSON.stringify(octopart_queries.toJS()),
    })
    .set('Accept', 'application/json')
    .then(res => {
      const results = res.body.results
      return queries.reduce((returns, q) => {
        const query_id = q.get('query_id')
        const result = results.find(r => r.reference === query_id)
        if (result == null) {
          return returns.set(query_id, immutable.List())
        }
        const items = immutable.List(result.items)
        if (items.size === 0) {
          return returns.set(query_id, immutable.List())
        }
        return returns.set(query_id, items.map(item => {
          return q.remove('query_id').merge({
            manufacturer : item.brand.name,
            description  : item.short_description,
            image        : image(item),
            datasheet    : datasheet(item)
          })
        }))
      }, immutable.Map())
    })
}

module.exports = octopart
