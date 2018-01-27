const immutable = require('immutable')

const retailers = {
  Farnell: require('./farnell'),
  Newark: require('./newark'),
}

const not_yet = immutable.List.of('Digikey', 'Mouser', 'RS')

function runRetailers(results) {
  return Promise.all(results.map((result, query) => {
    let promise
    if (immutable.List.isList(result)) {
      promise = Promise.all(result.map(run)).then(immutable.List)
    } else {
      promise = run(result)
    }
    return promise.then(r => {
      return [query, r]
    })
  }).toArray()).then(immutable.Map)
}

function run(part) {
  const offers = part.get('offers') || immutable.List()
  const not_yet_offers = offers.filter(offer => {
    const vendor = offer.getIn(['sku', 'vendor'])
    return not_yet.includes(vendor)
  })
  return Promise.all(Object.keys(retailers).map(name => {
    const this_offers = offers.filter(offer => (
      offer.getIn(['sku', 'vendor']) === name
    ))
    return runRetailer(name, this_offers)
  })).then(newOffers => {
    return part.set('offers', immutable.List(newOffers).flatten(1).concat(not_yet_offers))
  })
}

function runRetailer(name, offers) {
  return Promise.all(offers.map(offer => (
    retailers[name](offer.getIn(['sku', 'part'])).then(o => offer.mergeDeep(o))
  ))).then(immutable.List)
}

module.exports = runRetailers
