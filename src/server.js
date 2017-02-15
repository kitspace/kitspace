const superagent = require('superagent')
const apikey = require('./secrets').OCTOPART_API_KEY

const queries = [{mpn:'NE555P'}]

superagent.get('https://octopart.com/api/v3/parts/match')
  .query({queries: JSON.stringify(queries), apikey})
  .set('Accept', 'application/json')
  .then(res => {
    console.log(res.body.results)
  })
