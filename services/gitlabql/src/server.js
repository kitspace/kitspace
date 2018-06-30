const bodyParser = require('body-parser')
const express = require('express')
const {ApolloServer, gql} = require('apollo-server-express')
const {makeExecutableSchema} = require('graphql-tools')
const superagent = require('superagent')
const cookieParser = require('cookie-parser')

const typeDefs = gql`
  type Query {
    user: User
  }

  type User {
    id: Int!
    name: String!
    username: String!
    state: String!
    avatar_url: String!
    web_url: String!
    created_at: String!
    bio: String
    location: String
    skype: String
    linkedin: String
    twitter: String
    website_url: String
    organization: String
    last_sign_in_at: String
    confirmed_at: String
    last_activity_on: String
    email: String
    theme_id: Float
    color_scheme_id: Int
    projects_limit: Int
    current_sign_in_at: String
    identities: [String]
    can_create_group: Boolean
    can_create_project: Boolean
    two_factor_enabled: Boolean
    external: Boolean
    is_admin: Boolean
  }
`
// The resolvers
const resolvers = {
  Query: {
    user: (_, __, {cookie}) =>
      superagent
        .get('http://localhost:8080/!gitlab/api/v4/user')
        .set({cookie})
        .then(r => r.body),
  },
}

// Put together a schema
const schema = makeExecutableSchema({
  typeDefs,
  resolvers,
})

const server = new ApolloServer({
  schema,
  context: ({req}) => {
    return {cookie: req.headers.cookie}
  },
})

const app = express()
app.use(cookieParser())
server.applyMiddleware({app, path: '/'})

app.listen({port: 3000}, () => {
  console.log(`Server ready at port 3000${server.graphqlPath}`)
})
