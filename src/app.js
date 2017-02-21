const expressGraphql = require('express-graphql')
const express        = require('express')
const {store} = require('./actions')

const schema = require('./schema')
const {handleQueries} = require('./handle_changes')

store.subscribeChanges('queries', handleQueries)

const app = express()

app.use('/graphql', expressGraphql((req) =>  {
  return {
    schema,
    graphiql: true,
    rootValue: {},
  }
}))

module.exports = app
