const immutable = require('immutable')
const osmosis   = require('osmosis')

function newark(sku) {
  return new Promise((resolve, reject) => {
    const url = `http://www.newark.com/${sku}`
    osmosis.get(url)
      .set({
        url         : '#productMainImage @src',
        names       : ['dt[id^=descAttributeName]'],
        values      : ['dd[id^=descAttributeValue]'],
        description : "[itemprop='name']",
        quantities  : ['td.qty @value'],
        prices      : ['td.threeColTd'],
        uk_stock    : 'span[id^=internalDirectShipTooltip_] !>',
        not_normally_stocked: 'span[id^=notNormallyStockedTooltip_] !>',
        stock: '.availabilityHeading.available',
      })
      .data(data => {
        const {
          url,
          names,
          values,
          description,
          quantities,
          prices,
          uk_stock,
          not_normally_stocked,
          stock,
        } = data
        resolve(immutable.Map({
          image: immutable.Map({
            url,
            credit_string : 'Newark',
            credit_url    : 'http://www.newark.com',
          }),
          stock_info: immutable.fromJS([
            {
              key: 'stock',
              name: 'Stock',
              value: stock,
            },
            {
              key: 'stock_location',
              name: 'Location',
              value: uk_stock ? 'UK' : 'US',
            },
          ]),
          description,
          specs: immutable.List(names).zip(values)
            .map(([name, value]) => immutable.Map({name, value})),
          prices: immutable.Map({
            USD: immutable.List(quantities).zip(prices)
              .map(([qty, price]) => (
                immutable.List.of(parseInt(qty), parseFloat(price.slice(1)))
              )),
          })
        }))
      })
      .error(e =>  {
        if (e.indexOf('404') > -1) {
          resolve(immutable.fromJS({
            stock_info: [
              {
                key: 'stock',
                name: 'Stock',
                value: 'No longer stocked',
              },
            ]
          }))
        } else {
          reject(e)
        }
      })
      .done()
  })
}

module.exports = newark
