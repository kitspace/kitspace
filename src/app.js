const expressGraphql = require('express-graphql')
const express        = require('express')

const schema = require('./schema')

const app = express()

app.use('/graphql', expressGraphql((req) =>  {
  return {
    schema,
    graphiql: true,
    rootValue: {},
  }
}))

module.exports = app
