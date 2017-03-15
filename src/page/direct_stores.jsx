const React      = require('react')
const superagent = require('superagent')

const digikey_data   = require('1-click-bom/lib/data/digikey.json')
const farnell_data   = require('1-click-bom/lib/data/farnell.json')
const countries_data = require('1-click-bom/lib/data/countries.json')

function getFreegeoip(code) {
  const url = 'https://freegeoip.kitnic.it'
  return superagent.get(url)
    .then(res => res.body.country_code)
    .catch(err => {
      console.error(err)
      return 'Other'
    })
}

function queryOSM(position) {
  const {longitude, latitude} = position.coords
  const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
  return superagent.get(url)
    .then(res => {
      const code = res.body.address.country_code
      return code.toUpperCase()
    }).catch(err => null)
}

function getNavigator() {
  return new Promise(resolve => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(pos => {
        return resolve(queryOSM(pos))
      }, err => resolve(null))
    } else {
      resolve(null)
    }
  })
}

function getLocation() {
  return getNavigator().then(code => {
    if (code) {
      return code
    }
    return getFreegeoip()
  })
}

const DirectStores = React.createClass({
  propTypes: {
    items: React.PropTypes.any.isRequired,
    multiplier: React.PropTypes.number.isRequired
  },
  getInitialState() {
    const used_country_codes = Object.keys(countries_data).map(key => {
      return countries_data[key]
    })
    if (typeof window != 'undefined'){
      getLocation().then(code => {
        if (code === 'GB') {
          code = 'UK'
        }
        if (used_country_codes.indexOf(code) < 0) {
          code = 'Other'
        }
        this.setState({countryCode: code})
      })
    }
    return {
      countryCode: 'Other'
    }
  },
  getParts(retailer) {
    let parts = this.props.items
    parts = parts.filter(part => {
      return retailer in part.retailers && part.retailers[retailer] != ''
    })
    parts = parts.map( part => {
      return {
        sku: part.retailers[retailer],
        reference: part.reference,
        quantity: Math.ceil(this.props.multiplier * part.quantity)
      }
    }
    )
    return parts
  },
  digikeyPartRenderer(part, index) {
    index++
    return (
      <span key={`digikeyRenderer${index}`}>
        <input type='hidden' name={`part${index}`} value={part.sku} />
        <input type='hidden' name={`qty${index}`} value={part.quantity} />
        <input type='hidden' name={`cref${index}`} value={part.reference} />
      </span>
      )
  },
  digikey(countryCode, parts) {
    const site = digikey_data.sites[digikey_data.lookup[countryCode]]
    return (
      <form
      target="_blank"
      key='DigikeyForm'
      id='DigikeyForm'
      method='POST'
      action={`https${site}/classic/ordering/fastadd.aspx` +
      '?WT.z_cid=ref_kitnic'}>
        { parts.map(this.digikeyPartRenderer) }
      </form>)

  },
  tildeDelimiter(part) {
    return part.sku + '~' + part.quantity
  },
  farnell(countryCode, parts) {
    const site = farnell_data.sites[farnell_data.lookup[countryCode]]
    const queryString = parts.map(this.tildeDelimiter).join('~')
    return (
      <form
      target="_blank"
      key='FarnellForm'
      id='FarnellForm'
      method='GET'
      action={`https${site}/jsp/extlink.jsp`} >
        <input type='hidden' name='CMP' value='ref_kitnic' />
        <input type='hidden' name='action' value='buy' />
        <input type='hidden' name='product' value={queryString} />
      </form>
      )
  },
  newark(parts) {
    const queryString = parts.map(this.tildeDelimiter).join('~')
    return (
      <form
      target="_blank"
      key='NewarkForm'
      id='NewarkForm'
      method='GET'
      action='https://www.newark.com/jsp/extlink.jsp' >
        <input type='hidden' name='CMP' value='ref_kitnic' />
        <input type='hidden' name='action' value='buy' />
        <input type='hidden' name='product' value={queryString} />
      </form>
      )
  },

  render() {
    const digikeyParts = this.getParts('Digikey')
    const farnellParts = this.getParts('Farnell')
    const newarkParts  = this.getParts('Newark')
    return (
      <span>
      {[
        this.digikey(this.state.countryCode, digikeyParts),
        this.farnell(this.state.countryCode, farnellParts),
        this.newark(newarkParts)
      ]}
       </span>
      )
  }
})
module.exports = DirectStores
