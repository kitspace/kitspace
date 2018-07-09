const bodyParser = require('body-parser')
const express = require('express')
const {ApolloServer, gql, AuthenticationError} = require('apollo-server-express')
const {makeExecutableSchema} = require('graphql-tools')
const superagent = require('superagent')
const cookieParser = require('cookie-parser')
const graphqlFields = require('graphql-fields')

require('dotenv').config({path: '../../.env'})

const {GITLAB_TOKEN, KITSPACE_GITLAB_PORT} = process.env

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
    ): ProjectsPage!
  }

  type ProjectsPage {
    page: Int!
    nodes: [Project]!
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

  #type Statistics {
  #  commit_Vcount: Int!
  #  storage_size: Int!
  #  repository_size: Int!
  #  lfs_objects_size: Int!
  #  job_artifacts_size: Int!
  #}

  type Namespace {
    id: ID!
    name: String!
    path: String!
    kind: String!
    full_path: String!
  }
`

const simpleProjectFields = Object.freeze([
  'id',
  'description',
  'name',
  'name_with_namespace',
  'path',
  'path_with_namespace',
  'created_at',
  'default_branch',
  'tag_list',
  'ssh_url_to_repo',
  'http_url_to_repo',
  'web_url',
  'readme_url',
  'avatar_url',
  'star_count',
  'forks_count',
  'last_activity_at',
])

const resolvers = {
  Query: {
    user: (_, __, {user}) => {
      return user
    },
    projects: (_, params, {cookie, user}, info) => {
      const topLevelFields = Object.keys(graphqlFields(info))
      if (topLevelFields.every(f => simpleProjectFields.includes(f))) {
        params.simple = true
      }
      const page = params.page || 1
      const p = superagent
        .get(`http://localhost:${KITSPACE_GITLAB_PORT}/!gitlab/api/v4/projects`)
        .query(params)
      //give unauthenticated users full visibility of public projects
      if (!user && !params.simple) {
        p.query({visibility: 'public', private_token: GITLAB_TOKEN})
      }
      if (cookie) {
        p.set({cookie})
      }
      return p.then(r => ({page, nodes: r.body}))
    },
  },
}

const schema = makeExecutableSchema({
  typeDefs,
  resolvers,
})

const server = new ApolloServer({
  schema,
  context: ({req}) => {
    const cookie = req.headers.cookie
    return superagent
      .get(`http://localhost:${KITSPACE_GITLAB_PORT}/!gitlab/api/v4/user`)
      .set({cookie})
      .catch(e => ({user: null, cookie}))
      .then(r => ({user: r.body, cookie}))
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
