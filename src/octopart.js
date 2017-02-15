const superagent = require('superagent')
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

function octopart(queries) {
  const indexed = queries.map((q, index) => Object.assign(q, {reference: index}))
  return superagent.get('https://octopart.com/api/v3/parts/match')
    .query('include[]=short_description&include[]=imagesets&include[]=datasheets')
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
          image: image(items),
          datasheet: datasheet(items),
        })
      })
    })
}

const queries = [{mpn:'ATMEGA32U4AUR'}, {mpn: 'NE555P'}]
octopart(queries).then(r => console.log(r))
