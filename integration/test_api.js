const graphqlTester = require('graphql-tester')
const createExpressWrapper = require('graphql-tester/lib/main/servers/express.js')
  .create
const assert = require('assert')

const app = require('../src/app')

describe('API', () => {
  const test = graphqlTester.tester({
    server: createExpressWrapper(app),
    url: '/graphql'
  })
  it('responds', done => {
    test('{fromMpn(mpn: {mpn: "NE555P"}) {description} }').then(response => {
      assert(response.success, 'response failed')
      assert(response.status === 200, 'status is not 200')
      assert(response.data.fromMpn != null, 'fromMpn data not returned')
      return done()
    })
  })
  it('responds twice', done => {
    test('{fromMpn(mpn: {mpn: "NE555P"}) {description} }').then(response => {
      assert(response.success, 'response failed')
      assert(response.status === 200, 'status is not 200')
      assert(response.data.fromMpn != null, 'fromMpn data not returned')
      return done()
    })
  })
  it('fills in manufacturer', done => {
    test('{fromMpn(mpn: {mpn: "NE555P"}) {manufacturer} }').then(response => {
      assert(response.success, 'response failed')
      assert(response.status === 200, 'status is not 200')
      assert(response.data.fromMpn != null, 'fromMpn data not returned')
      assert(response.data.fromMpn.manufacturer != null, 'manufacturer is null')
      return done()
    })
  })
  it("doesn't overwrite manufacturer", done => {
    test(`{
       fromMpn(mpn: {manufacturer: "mock", mpn: "NE555P"}) {
         manufacturer
      }
    }`).then(response => {
      assert(response.success, 'response failed')
      assert(response.status === 200, 'status is not 200')
      assert(response.data.fromMpn != null, 'fromMpn data not returned')
      assert(response.data.fromMpn.manufacturer === 'mock', 'manufacturer changed')
      return done()
    })
  })
  it('returns even without results', done => {
    test('{fromMpn(mpn: {mpn: "not really a part"}) {description} }').then(response => {
      assert(response.success, 'response failed')
      assert(response.status === 200, 'status is not 200')
      return done()
    })
  })
})
