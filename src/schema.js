const immutable = require('immutable')
const graphqlTools = require('graphql-tools')
const {request_bus, response_bus} = require('./message_bus')

const Mpn = `{
     manufacturer : String!
     part         : String!
}`

const Sku = `{
    vendor : String!
    part   : String!
}`

const schema = `
  type Mpn ${Mpn}
  input MpnInput ${Mpn}

  type Sku ${Sku}
  input SkuInput ${Sku}

  type Query {
    part(mpn: MpnInput, sku: SkuInput): Part
    search(term: String!): [Part]!
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
    SGD: [[Float]]
  }

  type Image {
    url           : String
    credit_string : String
    credit_url    : String
  }

  type Spec {
    key   : String
    name  : String
    value : String
  }
`

const resolverMap = {
  Query: {
    part(_, {mpn, sku}) {
      if (! (mpn || sku)) {
        return Error('Mpn or Sku required')
      }
      return run({mpn, sku})
    },
    search(_, {term}) {
      if (! term) {
        return []
      }
      return run({term})
    },
  }
}

function makeId() {
  if (this.id == null) {
    this.id = 0
  }
  return ++this.id
}

function run(query) {
  const id = makeId()
  query.id = id
  query = immutable.fromJS(query)
  const time_stamped = immutable.Map({
    query,
    time: Date.now(),
  })
  return new Promise((resolve, reject) => {
    response_bus.once(id, r => {
      if (query.get('term')) {
        r = r.filter(x => x).filter(x => x.get('mpn'))
      } else if (!r.get('mpn')) {
        return resolve()
      }
      resolve(r.toJS())
    })
    request_bus.emit('request', time_stamped)
  })
}

module.exports = graphqlTools.makeExecutableSchema({
    typeDefs: schema,
    resolvers: resolverMap,
})
