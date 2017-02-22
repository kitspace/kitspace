const graphqlTester = require('graphql-tester')
const createExpressWrapper = require('graphql-tester/lib/main/servers/express.js')
  .create
const assert = require('assert')

const app = require('../src/app')

describe('from Mpn', () => {
  const test = graphqlTester.tester({
    server: createExpressWrapper(app),
    url: '/graphql'
  })
  it('responds', done => {
    test('{parts(mpn: {mpn: "NE555P"}) {mpn} }').then(response => {
      assert(response.success, 'response failed')
      assert(response.status === 200, 'status is not 200')
      assert(response.data.parts != null, 'parts data not returned')
      return done()
    })
  })
  it('responds twice', done => {
    test('{parts(mpn: {mpn: "NE555P"}) {mpn} }').then(response => {
      assert(response.success, 'response failed')
      assert(response.status === 200, 'status is not 200')
      assert(response.data.parts != null, 'parts data not returned')
      return done()
    })
  })
  it('fills in manufacturer', done => {
    test('{parts(mpn: {mpn: "NE555P"}) {manufacturer} }').then(response => {
      assert(response.success, 'response failed')
      assert(response.status === 200, 'status is not 200')
      assert(response.data.parts != null, 'parts data not returned')
      assert(response.data.parts[0].manufacturer != null, 'manufacturer is null')
      return done()
    })
  })
  it('returns even without results', done => {
    test('{parts(mpn: {mpn: "not really a part"}) {description} }').then(response => {
      assert(response.success, 'response failed')
      assert(response.status === 200, 'status is not 200')
      assert(response.data.parts.length === 0, 'got results')
      return done()
    })
  })
  it('returns offers array', done => {
    test('{parts(mpn: {mpn: "NE555P"}) {offers {vendor sku}} }').then(response => {
      assert(response.success, 'response failed')
      assert(response.status === 200, 'status is not 200')
      assert(response.data.parts != null, 'parts data not returned')
      assert(response.data.parts[0].offers != null, 'offers is null')
      assert(response.data.parts[0].offers.length > 0, 'offers is empty')
      return done()
    })
  })
})

describe('from Sku', () => {
  const test = graphqlTester.tester({
    server: createExpressWrapper(app),
    url: '/graphql'
  })
  it('responds', done => {
    test('{parts(sku: {vendor:"" sku: "NE555P"}) {offers {vendor sku}} }').then(response => {
      assert(response.success, 'response failed')
      assert(response.status === 200, 'status is not 200')
      assert(response.data.parts != null, 'parts data not returned')
      return done()
    })
  })
  it('returns same part when queried with offers', done => {
    const mpn = 'NE555P'
    test(`{
      parts(mpn: {mpn: "${mpn}"}) {
        offers {vendor sku}
      }
    }`).then(response => {
      assert(response.success, 'response failed')
      assert(response.status === 200, 'status is not 200')
      assert(response.data.parts != null, 'parts data not returned')
      const part = response.data.parts[0]
      assert(part.offers != null, 'offers is null')
      assert(part.offers.length > 0, 'offers is empty')
      const offer = part.offers[0]
      test(`{
        parts(sku: {sku: "${offer.sku}" vendor: "${offer.vendor}"}) {
           mpn
        }
      }`).then(response => {
        assert(response.success, 'second response failed')
        assert(response.status === 200, 'second status is not 200')
        assert(response.data.parts != null, 'second parts data not returned')
        const part = response.data.parts[0]
        assert(part.mpn === mpn, 'mpn changed')
        return done()
      })
    })
  })
})
