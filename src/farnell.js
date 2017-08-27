const immutable = require('immutable')
const osmosis   = require('osmosis')

function farnell(sku) {
  return new Promise((resolve, reject) => {
    const url = `http://uk.farnell.com/${sku}`
    osmosis.get(url)
      .set({
        url         : '#productMainImage @src',
        names       : ['dt[id^=descAttributeName]'],
        values      : ['dd[id^=descAttributeValue]'],
        description : "[itemprop='name']",
        quantities  : ['td.qty @value'],
        prices      : ['td.threeColTd'],
        us_stock    : 'span[id^=internalDirectShipTooltip_] !>',
      })
      .data(({url, names, values, description, quantities, prices, us_stock}) => {
        resolve(immutable.Map({
          image: immutable.Map({
            url,
            credit_string : 'Farnell',
            credit_url    : 'http://uk.farnell.com',
          }),
          stock_info: immutable.fromJS([
            {
              key: 'stock_location',
              name: 'Stock Location',
              value: us_stock ? 'US' : 'UK/Liege',
            },
          ]),
          description,
          specs: immutable.List(names).zip(values)
            .map(([name, value]) => immutable.Map({name, value})),
          prices: immutable.Map({
            GBP: immutable.List(quantities).zip(prices)
              .map(([qty, price]) => (
                immutable.List.of(parseInt(qty), parseFloat(price.slice(1)))
              )),
          })
        }))
      })
      .done()
  })
}

module.exports = farnell
