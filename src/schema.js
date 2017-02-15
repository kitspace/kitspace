const graphqlTools = require('graphql-tools')

const schema = `
  input MpnInput {
     manufacturer: String!
     mpn: String
  }

  type Mpn {
     manufacturer: String!
     mpn: String
  }

  input SkuInput {
    vendor: String!
    sku: String
  }

  type Sku {
    vendor: String!
    sku: String
  }

  type Query {
    part(sku: SkuInput!, mpn: MpnInput!): Part
  }

  type Part {
     mpn: Mpn
     skus: [Sku]
     image: Image
     datasheet: String
     description: String
  }

  type Image {
    url: String
    credit_string: String
    credit_url: String
  }
`

const resolverMap = {
  Query: {
    part(_, {mpn, sku}) {
      return {test:''}
    }
  }
}

module.exports = graphqlTools.makeExecutableSchema({
    typeDefs: schema,
    resolvers: resolverMap,
})
