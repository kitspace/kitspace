const immutable = require('immutable')

const retailers = {
  Farnell: require('./farnell')
}

function runRetailer(name, results) {
  const completed = results.map((result, query) => {
    let promise
    if (immutable.List.isList(result)) {
      promise = Promise.all(result.map(r => _run_retailer(name, r))).then(r => {
        return immutable.List(r)
      })
    } else {
      promise = _run_retailer(name, result)
    }
    return promise.then(r => [query, r])
  })
  return Promise.all(completed.values()).then(immutable.Map)
}

function _run_retailer(name, part) {
    const offers =  part.get('offers')
    if (offers == null) {
      return Promise.resolve(part)
    }
    const this_offers = offers.filter(offer => {
      return offer.get('sku').get('vendor') === name
    })
    const queries = this_offers.map(offer => {
      return retailers[name](offer.get('sku').get('part'))
        .then(this_info => offer.mergeDeep(this_info))
        .catch(e => {
          console.error(e)
          return offer
        })
    })
    return Promise.all(queries).then(completed_offers => {
      const not_this_offers = offers.filter(offer => {
        return offer.get('sku').get('vendor') !== name
      })
      return part.set('offers', not_this_offers.concat(completed_offers))
    })
}


module.exports = runRetailer
