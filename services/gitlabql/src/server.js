const bodyParser = require('body-parser')
const express = require('express')
const {ApolloServer, gql} = require('apollo-server-express')
const {makeExecutableSchema} = require('graphql-tools')
const superagent = require('superagent')
const cookieParser = require('cookie-parser')

// Some fake data
const books = [
  {
    title: "Harry Bowler and the Sorcerer's bowl",
    author: 'J.K. Bowling',
    id: 0,
  },
  {
    title: "Harry Potter and the Sorcerer's stone",
    author: 'J.K. Rowling',
    id: 1,
  },
  {
    title: 'Jurassic Park',
    author: 'Michael Crichton',
    id: 2,
  },
  {
    title: 'A',
    author: 'Michael Crichton',
    id: 3,
  },
  {
    title: 'B',
    author: 'Michael Crichton',
    id: 4,
  },
  {
    title: 'C',
    author: 'Michael Crichton',
    id: 5,
  },
  {
    title: 'E',
    author: 'Michael Crichton',
    id: 6,
  },
  {
    title: 'F',
    author: 'Michael Crichton',
    id: 7,
  },
  {
    title: 'G',
    author: 'Michael Crichton',
    id: 8,
  },
]

// The GraphQL schema in string form
const typeDefs = gql`
  type Query {
    books(cursor: Int): Books
    user: User
  }

  type Books {
    nextCursor: Int!
    books: [Book]
  }

  type Book {
    id: Int!
    title: String
    author: String
  }

  type User {
    id: Int!
    name: String!
  }
`
// The resolvers
const resolvers = {
  Query: {
    books: (root, {cursor}, ctx) => {
      console.log({ctx})
      cursor = parseInt(cursor)
      const nextCursor = cursor + 2
      return {books: books.slice(cursor, nextCursor), nextCursor}
    },
    user: (_, __, ctx) => {
      console.log({ctx})
      return ctx.user
    },
  },
}

// Put together a schema
const schema = makeExecutableSchema({
  typeDefs,
  resolvers,
})

// In the most basic sense, the ApolloServer can be started
// by passing type definitions (typeDefs) and the resolvers
// responsible for fetching the data for those types.
const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: ({req}) => {
    return superagent
      .get('http://localhost:8080/!gitlab/api/v4/user')
      .set('cookie', req.headers.cookie)
      .then(r => ({user: r.body, cookie: req.headers.cookie}))
  },
})

const app = express()
app.use(cookieParser())
server.applyMiddleware({app, path: '/'})
// This `listen` method launches a web-server.  Existing apps
// can utilize middleware options, which we'll discuss later.
app.listen({port: 3000}, () => {
  console.log(`Server ready at port 3000${server.graphqlPath}`)
})
