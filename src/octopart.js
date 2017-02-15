const superagent = require('superagent')
const apikey = require('./secrets').OCTOPART_API_KEY

const queries = [{mpn:'ATMEGA32U4AUR'}, {mpn: 'NE555P'}]


function octopart(queries) {
  const indexed = queries.map((q, index) => Object.assign(q, {reference: index + 1}))
  console.log(indexed)
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
        const description = items.reduce((prev, x) => {
          return prev || x.short_description
        }, null)
        const imageset = items.reduce((prev, {imagesets}) => {
          return prev || imagesets.reduce((prev, set) => prev || set)
        }, null)
        const manufacturer = items.reduce({prev
        return Object.assign(q, {description, imageset})
      })
    })
}

octopart(queries).then(r => console.log(r))
