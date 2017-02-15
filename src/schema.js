const graphqlTools = require('graphql-tools')

const schema = `
  type Test {
    test: String
  }

  type Query {
    test: Test
  }

  type Part {
     manufacturer: String
     mpn: String
     image: Image
     datasheet: String
  }

  type Image {
    url: String
    credit_string: String
    credit_url: String
  }
`

const resolverMap = {
  Query: {
    test(_, {mpn, sku}) {
      return {test:''}
    }
  }
}

module.exports = graphqlTools.makeExecutableSchema({
    typeDefs: schema,
    resolvers: resolverMap,
})
