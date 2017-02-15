const superagent = require('superagent')
const apikey = require('./secrets').OCTOPART_API_KEY

const queries = [{mpn:'ATMEGA32U4AUR'}, {mpn: 'NE555P'}]

function description(items) {
  return items.reduce((prev, x) => prev || x.short_description, null)
}

function imageset(items) {
  return items.reduce((prev, x) => {
    return prev || x.imagesets.reduce((prev, set) => prev || set, null)
  }, null)
}

function octopart(queries) {
  const indexed = queries.map((q, index) => Object.assign(q, {reference: index}))
  return superagent.get('https://octopart.com/api/v3/parts/match')
    .query('include[]=short_description&include[]=imagesets')
    .query({
      apikey,
      queries: JSON.stringify(indexed),
    })
    .set('Accept', 'application/json')
    .then(res => {
      const results = res.body.results
      return indexed.map(q => {
        const result = results.find(r => r.reference === q.reference)
        if (result == null) {
          return q
        }
        const items = result.items
        return Object.assign(q, {
          description: description(items),
          imageset: imageset(items)
        })
      })
    })
}

octopart(queries).then(r => console.log(r))
