const express = require('express')
const bodyParser = require('body-parser')
const {ApolloServer, gql} = require('apollo-server')
const {makeExecutableSchema} = require('graphql-tools')

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
    books(cursor: ID): Books
  }

  type Books {
    nextCursor: ID!
    books: [Book]
  }

  type Book {
    id: ID!
    title: String
    author: String
  }
`

// The resolvers
const resolvers = {
  Query: {
    books: (_, {cursor}) => {
      cursor = parseInt(cursor)
      nextCursor = cursor + 2
      return {books: books.slice(cursor, nextCursor), nextCursor}
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
  context: req => console.log(req),
})


// This `listen` method launches a web-server.  Existing apps
// can utilize middleware options, which we'll discuss later.
server.listen(3000).then(({url}) => {
  console.log(`🚀  Server ready at ${url}`)
})
