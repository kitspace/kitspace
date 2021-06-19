const fetch = require('node-fetch')
exports.handler = async event => {
  console.log(`Received a submission: ${event.body}`)
  const data = JSON.parse(event.body).payload.data
  const {email, updates, new_projects, articles, anything_else} = data
  const tags = []
  if (updates) {
    tags.push('updates')
  }
  if (new_projects) {
    tags.push('new_projects')
  }
  if (articles) {
    tags.push('articles')
  }
  let metadata
  if (anything_else) {
    metadata = {anything_else}
  }
  return fetch('https://api.buttondown.email/v1/subscribers', {
    method: 'POST',
    headers: {
      Authorization: `Token ${process.env.BUTTONDOWN_TOKEN}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({email, tags, metadata})
  })
    .then(response => response.json())
    .then(data => {
      console.log(`Submitted to Buttondown:\n ${JSON.stringify(data, null, 2)}`)
    })
    .catch(error => ({statusCode: 422, body: String(error)}))
}
