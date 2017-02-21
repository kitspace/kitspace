const immutable = require('immutable')
const graphqlTools = require('graphql-tools')
const {store, actions} = require('./actions')

const Mpn = `{
     manufacturer : String
     mpn          : String!
}`

const Sku = `{
    vendor : String!
    sku    : String!
}`

const schema = `
  type Mpn ${Mpn}
  input MpnInput ${Mpn}

  type Sku ${Sku}
  input SkuInput ${Sku}

  type Query {
    fromMpn(mpn: MpnInput!): Part
    fromSku(sku: SkuInput!): Part
  }

  type Part {
     mpn         : Mpn!
     image       : Image!
     datasheet   : String!
     description : String!
     skus        : [Sku]!
  }

  type Image {
    url           : String!
    credit_string : String!
    credit_url    : String!
  }
`

const resolverMap = {
  Query: {
    fromMpn(_, {mpn}) {
      const reference = immutable.Map(mpn)
      const unsubscribe = store.subscribeChanges(['responses', reference], r => {
        if (r) {
          unsubscribe()
          return r.toJS()
        }
      })
      const query = immutable.Map({
        mpn: mpn.mpn,
        manufacturer: mpn.manufacturer,
        time: Date.now(),
        reference,
      })
      actions.addQuery(query)
    },
    fromSku(_, {sku}) {
      return
    },
  }
}

module.exports = graphqlTools.makeExecutableSchema({
    typeDefs: schema,
    resolvers: resolverMap,
})
