const expressGraphql = require('express-graphql')
const express        = require('express')
const {store} = require('./actions')

const schema = require('./schema')
const {handleQueries} = require('./handle_changes')

store.subscribeChanges(['queries'], handleQueries)
function loop() {
  setTimeout(() => {
    const state = store.getState()
    handleQueries(state.get('queries'))
    loop()
  }, 1000)
}
loop()

const app = express()

app.use('/graphql', expressGraphql((req) =>  {
  return {
    schema,
    graphiql: true,
    rootValue: {},
  }
}))

module.exports = app
