const immutable = require('immutable')
const graphqlTools = require('graphql-tools')
const {store, actions} = require('./actions')

const Mpn = `
     manufacturer : String
     mpn          : String!
`

const Sku = `
    vendor : String!
    sku    : String!
`

const schema = `
  input Mpn {${Mpn}}

  input Sku {${Sku}}

  type Query {
    parts(mpn: Mpn, sku: Sku): [Part]
  }

  type Part {
     ${Mpn}
     image       : Image
     datasheet   : String
     description : String
     offers      : [Offer]!
  }

  type Offer {
    ${Sku}
  }

  type Image {
    url           : String
    credit_string : String
    credit_url    : String
  }
`

const resolverMap = {
  Query: {
    parts(_, {mpn, sku}) {
      if (! (mpn || sku)) {
        return Error('Mpn or Sku required')
      }
      return query(Object.assign(mpn || {},  sku))
    },
  }
}

function query (mpn_or_sku) {
  const query_id = hash(mpn_or_sku)
  return new Promise((resolve, reject) => {
    const state = store.getState()
    const response = state.get('responses').get(query_id)
    if (response) {
      return resolve(response.toJS())
    }
    const unsubscribe = store.subscribeChanges(['responses', query_id], r => {
      if (r) {
        unsubscribe()
        resolve(r.toJS())
      }
    })
    const q = immutable.Map(mpn_or_sku).merge({
      time: Date.now(),
      query_id,
    })
    actions.addQuery(q)
  })
}

function hash(obj) {
  return String(immutable.Map(obj).hashCode())
}

module.exports = graphqlTools.makeExecutableSchema({
    typeDefs: schema,
    resolvers: resolverMap,
})
