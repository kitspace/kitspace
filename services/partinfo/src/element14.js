const immutable = require('immutable')
const osmosis   = require('osmosis')
const url       = require('url')

function element14(name, sku) {
  return new Promise((resolve, reject) => {
    let site, currency
    if (name === 'Newark') {
      site = 'http://www.newark.com/'
      currency = 'USD'
    } else if (name === 'Farnell') {
      site = 'http://uk.farnell.com/'
      currency = 'GBP'
    } else {
      throw Error(`Only Newark and Farnell supported, got ${name}`)
    }
    const sku_url = site + sku
    osmosis.get(sku_url)
      .set({
        image_src            : '#productMainImage @src',
        names                : ['dt[id^=descAttributeName]'],
        values               : ['dd[id^=descAttributeValue]'],
        description          : "[itemprop='name']",
        quantities           : ['td.qty @value'],
        prices               : ['td.threeColTd'],
        foreign_stock        : 'span[id^=internalDirectShipTooltip_] !>',
        not_normally_stocked : 'span[id^=notNormallyStockedTooltip_] !>',
        stock                : '.availabilityHeading',
      })
      .data(data => {
        const {
          image_src,
          names,
          values,
          description,
          quantities,
          prices,
          foreign_stock,
          not_normally_stocked,
          stock,
        } = data
        const stock_location = foreign_stock
          ? name === 'Newark' ? 'UK' : 'US'
          : name === 'Newark' ? 'US' : 'UK'
        const stock_match = (stock && stock.match(/^(\d|,)+/)) || [0]
        const stock_number = `${stock_match[0]} (${stock_location})`
        resolve(immutable.Map({
          image: immutable.Map({
            url: image_src && url.resolve(site, image_src),
            credit_string : name,
            credit_url    : sku_url,
          }),
          stock_info: immutable.fromJS([
            {
              key: 'stock',
              name: 'Stock',
              value: stock_number,
            },
          ]),
          description,
          specs: immutable.List(names).zip(values)
            .map(([name, value]) => immutable.Map({name, value})),
          prices: immutable.Map({
            [currency]: immutable.List(quantities).zip(prices)
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

module.exports = element14
