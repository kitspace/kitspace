const immutable = require('immutable')
const graphqlTools = require('graphql-tools')
const {store, actions} = require('./actions')

const Mpn = `{
     manufacturer : String!
     part       : String!
}`

const Sku = `{
    vendor : String!
    part : String!
}`

const schema = `
  type Mpn ${Mpn}
  input MpnInput ${Mpn}

  type Sku ${Sku}
  input SkuInput ${Sku}

  type Query {
    part(mpn: MpnInput, sku: SkuInput): Part
  }

  type Part {
     mpn         : Mpn
     image       : Image
     datasheet   : String
     description : String
     offers      : [Offer]
     specs       : [Spec]
  }

  type Offer {
    sku         : Sku
    prices      : Prices
    image       : Image
    description : String
    specs       : [Spec]
  }

  type Prices {
    USD: [[Float]]
    EUR: [[Float]]
    GBP: [[Float]]
  }

  type Image {
    url           : String
    credit_string : String
    credit_url    : String
  }

  type Spec {
    key: String
    name: String
    value: String
  }
`

const resolverMap = {
  Query: {
    part(_, {mpn, sku}) {
      if (! (mpn || sku)) {
        return Error('Mpn or Sku required')
      }
      return run({mpn,sku})
    },
  }
}

function run(query) {
  query = immutable.fromJS(query)
  return new Promise((resolve, reject) => {
    const state = store.getState()
    const response = state.get('responses').get(query)
    if (response) {
      return resolve(response.toJS())
    }
    const unsubscribe = store.subscribeChanges(['responses', query], r => {
      if (r) {
        unsubscribe()
        resolve(r.toJS())
      }
    })
    const time_stamped = immutable.Map({
      query,
      time: Date.now(),
    })
    actions.addQuery(time_stamped)
  })
}

module.exports = graphqlTools.makeExecutableSchema({
    typeDefs: schema,
    resolvers: resolverMap,
})
