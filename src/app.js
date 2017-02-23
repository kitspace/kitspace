const expressGraphql = require('express-graphql')
const express        = require('express')

const {store}         = require('./actions')
const schema          = require('./schema')
const {handleQueries} = require('./handle_changes')
const config          = require('../config')

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

//allow enabled cross origin requests
app.use((req, res, next) =>  {
    const origin = req.get('origin')
    if (config.ALLOWED_CORS_DOMAINS.indexOf(origin) >= 0) {
        res.header('Access-Control-Allow-Origin', origin)
        res.header('Access-Control-Allow-Methods', 'GET,POST')
        res.header('Access-Control-Allow-Headers', 'Content-Type')
        res.header('Access-Control-Allow-Credentials', 'true')
    }
    return next()
})

app.use('/graphql', expressGraphql((req) =>  {
  return {
    schema,
    graphiql: true,
    rootValue: {},
  }
}))

module.exports = app
