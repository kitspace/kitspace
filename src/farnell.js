const immutable = require('immutable')
const superagent = require('superagent')
const jsdom = new (require('jsdom').JSDOM)
const DOMParser = new (jsdom.window.DOMParser)

function farnell(results) {
  const completed = results.map((result, query) => {
    const offers =  result.get('offers')
    const farnellOffers = offers.filter(offer => {
      return offer.get('sku').get('vendor') === 'Farnell'
    })
    const queries = farnellOffers.map(offer => {
      return runQuery(offer.get('sku').get('part'))
        .then(farnellInfo => {
          if (offer.get('image') == null) {
            return offer.set('image', farnellInfo.get('image'))
          }
          return offer
        })
    })
    return Promise.all(queries).then(completedOffers => {
      const notFarnellOffers = offers.filter(offer => {
        return offer.get('sku').get('vendor') !== 'Farnell'
      })
      return [query, result.set('offers', notFarnellOffers.concat(completedOffers))]
    })
  })
  return Promise.all(completed.values()).then(immutable.Map)
}

function runQuery(sku) {
    const url = `http://uk.farnell.com/${sku}`

    return superagent.get(url)
      .then(r => DOMParser.parseFromString(r.text, 'text/html'))
      .then(extractElements)
      .catch(e => console.error(e))
}

function extractElements(doc) {
  return immutable.Map({
    image: extractImage(doc),
  })
}

function extractImage(doc) {
  const url = doc.querySelector('#productMainImage').src
  return immutable.Map({
    url,
    credit_string: 'Farnell',
    credit_url: 'http://uk.farnell.com',
  })
}

module.exports = farnell
