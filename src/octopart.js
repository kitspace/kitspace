const superagent = require('superagent')
const immutable = require('immutable')
const apikey = require('./secrets').OCTOPART_API_KEY


function description(items) {
  return items.reduce((prev, x) => prev || x.short_description, null)
}

function datasheet(items) {
  return items.reduce((prev, x) => {
    return x.datasheets.reduce((prev, d) => prev || d.url, prev)
  }, null)
}

function image(items) {
  return items.reduce((prev, x) => {
    return prev || x.imagesets.reduce((prev, set) => {
      if (prev != null) {
        return prev
      }
      if (set.medium_image && set.medium_image.url) {
        return {
          url: set.medium_image.url,
          credit_string: set.credit_string,
          credit_url: set.credit_url
        }
      }
      return null
    }, null)
  }, null)
}

const OCTOPART_QUERY_KEYS = immutable.List.of('reference', 'mpn', 'manufacturer')

function octopart(queries) {
  queries = queries.map(q => {
    return q.filter((_, k) => {
      return OCTOPART_QUERY_KEYS.contains(k)
    })
  })
  return superagent.get('https://octopart.com/api/v3/parts/match')
    .query('include[]=short_description&include[]=imagesets&include[]=datasheets')
    .query({
      apikey,
      queries: JSON.stringify(queries.toJS()),
    })
    .set('Accept', 'application/json')
    .then(res => {
      const results = res.body.results
      return queries.map(q => {
        const result = results.find(r => r.reference === q.get('reference'))
        if (result == null) {
          return q
        }
        const items = result.items
        return q.merge({
          description: description(items),
          image: immutable.Map(image(items)),
          datasheet: datasheet(items),
        })
      })
    })
}

const queries = immutable.List.of(
  immutable.Map({reference: 1, mpn:'ATMEGA32U4AUR'}),
  immutable.Map({reference: 2, mpn: 'NE555P'})
)
octopart(queries).then(r => console.log(r))
