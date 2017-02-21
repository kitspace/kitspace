const graphqlTester = require('graphql-tester')
const createExpressWrapper = require('graphql-tester/lib/main/servers/express.js').create

const app = require('../src/app')

describe('API', () => {
  const test = graphqlTester.tester({
    server: createExpressWrapper(app),
    url: '/graphql'
  })
  it('responds', done => {
    test('{ fromMpn(mpn: "NE555P") }').then(response => {
      assert(response.success)
      assert(response.status === 200)
      assert(response.data.fromMpn != null)
      return done()
    })
  })
})
