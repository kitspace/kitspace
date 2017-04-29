const immutable  = require('immutable')
const superagent = require('superagent')
const jsdom      = new (require('jsdom').JSDOM)
const DOMParser  = new jsdom.window.DOMParser

const {extract, extractLink} = require('./extract')

function farnell(results) {
  const completed = results.map((result, query) => {
    const offers =  result.get('offers')
    if (offers == null) {
      return Promise.resolve([query, result])
    }
    const farnell_offers = offers.filter(offer => {
      return offer.get('sku').get('vendor') === 'Farnell'
    })
    const queries = farnell_offers.map(offer => {
      return runQuery(offer.get('sku').get('part'))
        .then(farnell_info => offer.merge(farnell_info))
        .catch(e => {
          console.warn(e)
          return offer
        })
    })
    return Promise.all(queries).then(completed_offers => {
      const not_farnell_offers = offers.filter(offer => {
        return offer.get('sku').get('vendor') !== 'Farnell'
      })
      return [query, result.set('offers', not_farnell_offers.concat(completed_offers))]
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
  const a = doc.querySelector('#productMainImage')
  if (a == null) {
    return null
  }
  return immutable.Map({
    url           : a.src,
    credit_string : 'Farnell',
    credit_url    : 'http://uk.farnell.com',
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
