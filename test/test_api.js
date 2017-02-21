const graphqlTester  = require('graphql-tester')
const {expect}       = require('chai')
const createExpressWrapper = require('graphql-tester/lib/main/servers/express.js').create

const app = require('../src/app')

describe('API', () => {
  const test = graphqlTester.tester({
    server: createExpressWrapper(app),
    url: '/graphql'
  })
  it('responds', done => {
    test('{fromMpn(mpn: "NE555P")}').then(response => {
      expect(response.success).to.be.ok
      expect(response.status).to.equal(200)
      expect(response.data.fromMpn).to.be.ok
      return done()
    })
  })
})
