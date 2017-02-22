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
    fromMpn(mpn: Mpn!): [Part]
    fromSku(sku: Sku!): [Part]
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
    fromMpn(_, {mpn}) {
      return new Promise((resolve, reject) => {
        const query_id = hash(mpn)
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
        const query = immutable.Map({
          mpn: mpn.mpn,
          manufacturer: mpn.manufacturer,
          time: Date.now(),
          query_id,
        })
        actions.addQuery(query)
      })
    },
    fromSku(_, {sku}) {
      return
    },
  }
}

function hash(obj) {
  return String(immutable.Map(obj).hashCode())
}

module.exports = graphqlTools.makeExecutableSchema({
    typeDefs: schema,
    resolvers: resolverMap,
})
