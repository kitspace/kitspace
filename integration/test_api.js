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
    test(`{
       part(mpn:{manufacturer:"Texas Instruments" part:"NE555P"}) {
         description
       }
    }`).then(response => {
      assert(response.success, 'response failed')
      assert(response.status === 200, 'status is not 200')
      assert(response.data.part != null, 'part data not returned')
      return done()
    })
  })
  it('responds twice', done => {
    test(`{
       part(mpn:{manufacturer:"Texas Instruments" part:"NE555P"}) {
         description
       }
    }`).then(response => {
      assert(response.success, 'response failed')
      assert(response.status === 200, 'status is not 200')
      assert(response.data.part != null, 'part data not returned')
      return done()
    })
  })
  it('fills in manufacturer', done => {
    test(`{
       part(mpn:{manufacturer:"Texas Instruments" part:"NE555P"}) {
         mpn {
           manufacturer
         }
       }
    }`).then(response => {
      assert(response.success, 'response failed')
      assert(response.status === 200, 'status is not 200')
      assert(response.data.part != null, 'part data not returned')
      assert(response.data.part.mpn.manufacturer != null, 'manufacturer is null')
      return done()
    })
  })
  it('returns even without results', done => {
    test(`{
       part(mpn:{manufacturer: "whatever" part:"not really a part"}) {
         mpn {
           manufacturer
         }
       }
    }`).then(response => {
      assert(response.success, 'response failed')
      assert(response.status === 200, 'status is not 200')
      assert(response.data.part == null, 'got results')
      return done()
    })
  })
  it('returns offers array', done => {
    test(`{
       part(mpn:{manufacturer:"Texas Instruments" part:"NE555P"}) {
         offers {
           sku {
             vendor
             part
           }
         }
       }
    }`).then(response => {
      assert(response.success, 'response failed')
      assert(response.status === 200, 'status is not 200')
      assert(response.data.part != null, 'part data not returned')
      assert(response.data.part.offers != null, 'offers is null')
      assert(response.data.part.offers.length > 0, 'offers is empty')
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
    test(`{
       part(sku:{vendor: "", part:"NE555P"}) {
         offers {
           sku {
             vendor
             part
           }
         }
       }
    }`).then(response => {
      assert(response.success, 'response failed')
      assert(response.status === 200, 'status is not 200')
      return done()
    })
  })
  it('returns same part when queried with offers', done => {
    const mpn = 'NE555P'
    test(`{
       part(mpn:{manufacturer: "Texas Instruments" part:"${mpn}"}) {
         offers {
           sku {
             vendor
             part
           }
         }
       }
    }`).then(response => {
      assert(response.success, 'response failed')
      assert(response.status === 200, 'status is not 200')
      assert(response.data.part != null, 'part data not returned')
      const part = response.data.part
      assert(part.offers != null, 'offers is null')
      assert(part.offers.length > 0, 'offers is empty')
      const sku = part.offers[0].sku
      test(`{
         part(sku:{vendor: "${sku.vendor}", part:"${sku.part}"}) {
           mpn {
             part
           }
         }
      }`).then(response => {
        assert(response.success, 'second response failed')
        assert(response.status === 200, 'second status is not 200')
        assert(response.data.part != null, 'second part data not returned')
        const part = response.data.part
        assert(part.mpn.part === mpn, 'mpn changed')
        return done()
      })
    })
  })
})

describe('search', () => {
  const test = graphqlTester.tester({
    server: createExpressWrapper(app),
    url: '/graphql'
  })
  it('responds', done => {
    test(`{
       search(term:"") {
         description
       }
    }`).then(response => {
      assert(response.success, 'response failed')
      assert(response.status === 200, 'status is not 200')
      return done()
    })
  })
  it('searches', done => {
    test(`{
       search(term:"SPI FLASH SOIC") {
         description
       }
    }`).then(response => {
      assert(response.success, 'response failed')
      assert(response.status === 200, 'status is not 200')
      assert(response.data.search != null, 'search data not returned')
      assert(response.data.search.length > 1, 'less than one result returned')
      return done()
    })
  })
})
