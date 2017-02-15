const octopart = require('octopart')
octopart.apikey = require('./secrets').OCTOPART_API_KEY

const queries = [{reference: 1, mpn:'NE555P'}]

octopart.parts.match(queries).success((body) => {
  body.results.forEach(r => console.log(r))
})
