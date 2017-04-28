const immutable = require('immutable')
const superagent = require('superagent')
const jsdom = new (require('jsdom').JSDOM)
const DOMParser = new (jsdom.window.DOMParser)

const {extract, extractLink} = require('./extract')

function farnell(results) {
  const completed = results.map((result, query) => {
    const offers =  result.get('offers')
    if (offers == null) {
      return Promise.resolve([query, result])
    }
    const farnellOffers = offers.filter(offer => {
      return offer.get('sku').get('vendor') === 'Farnell'
    })
    const queries = farnellOffers.map(offer => {
      return runQuery(offer.get('sku').get('part'))
        .then(farnellInfo => {
          return offer.merge(farnellInfo)
        })
        .catch(e => {
          console.warn(e)
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
}

function extractElements(doc) {
  return immutable.Map({
    image       : extractImage(doc),
    description : extractDescription(doc),
    specs       : extractSpecs(doc),
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

function extractSpecs(doc) {
  const names = immutable.List(doc.querySelectorAll('dt[id^=descAttributeName]'))
  const values = immutable.List(doc.querySelectorAll('dd[id^=descAttributeValue]'))
  return names.map((name, index) => {
    try {
      name = name.innerHTML.trim().slice(0, -1)
      const valueNode = values.get(index)
      const valueNodeChild = valueNode.children[0]
      if (valueNodeChild) {
        var value = valueNodeChild.innerHTML.trim()
      } else {
        var value = valueNode.innerHTML.trim()
      }
      return immutable.Map({name, value})
    }
    catch (e) {
      return immutable.Map()
    }
  })
}

function extractDescription(doc) {
    return extract("[itemprop='name']", doc)
}

module.exports = farnell
