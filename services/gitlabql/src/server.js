const bodyParser = require('body-parser')
const express = require('express')
const {ApolloServer, gql} = require('apollo-server-express')
const {makeExecutableSchema} = require('graphql-tools')
const superagent = require('superagent')
const cookieParser = require('cookie-parser')

const typeDefs = gql`
  scalar Date

  type Query {
    user: User
    projects(
      per_page: Int
      page: Int
      sort: String
      order_by: String
      visibility: String
      search: String
      owned: Boolean
      membership: Boolean
      starred: Boolean
    ): [Project]!
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

  type Project {
    id: ID!
    description: String
    default_branch: String
    visibility: String
    ssh_url_to_repo: String!
    http_url_to_repo: String!
    web_url: String!
    readme_url: String!
    tag_list: [String]
    owner: User!
    name: String
    name_with_namespace: String
    path: String!
    path_with_namespace: String!
    issues_enabled: Boolean!
    open_issues_count: Int!
    merge_requests_enabled: Boolean!
    jobs_enabled: Boolean!
    wiki_enabled: Boolean!
    snippets_enabled: Boolean!
    resolve_outdated_diff_discussions: Boolean!
    container_registry_enabled: Boolean!
    created_at: Date!
    last_activity_at: Date
    creator_id: Int!
    namespace: Namespace!
    import_status: String
    archived: Boolean!
    avatar_url: String!
    shared_runners_enabled: Boolean!
    forks_count: Int!
    star_count: Int!
    runners_token: String
    public_jobs: Boolean!
    # shared_with_groups: []
    only_allow_merge_if_pipeline_succeeds: Boolean!
    only_allow_merge_if_all_discussions_are_resolved: Boolean!
    request_access_enabled: Boolean!
    merge_method: String!
    #_links: {
    #  self: 'http://example.com/api/v4/projects'
    #  issues: 'http://example.com/api/v4/projects/1/issues'
    #  merge_requests: 'http://example.com/api/v4/projects/1/merge_requests'
    #  repo_branches: 'http://example.com/api/v4/projects/1/repository_branches'
    #  labels: 'http://example.com/api/v4/projects/1/labels'
    #  events: 'http://example.com/api/v4/projects/1/events'
    #  members: 'http://example.com/api/v4/projects/1/members'
    #}
  }

  type Statistics {
    commit_Vcount: Int!
    storage_size: Int!
    repository_size: Int!
    lfs_objects_size: Int!
    job_artifacts_size: Int!
  }

  type Namespace {
    id: ID!
    name: String!
    path: String!
    kind: String!
    full_path: String!
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
    projects: (_, params, {cookie}) => {
      console.log(params)
      const p = superagent
        .get('http://localhost:8080/!gitlab/api/v4/projects')
        .query(params)
      if (cookie) {
        p.set({cookie})
      }
      return p.then(r => r.body)
    },
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

function trace(x) {
  console.log(x)
  return x
}
