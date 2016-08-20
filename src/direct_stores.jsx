'use strict';
const React = require('react');

const digikey_data   = require('1-click-bom/lib/data/digikey.json');
const farnell_data   = require('1-click-bom/lib/data/farnell.json');
const countries_data = require('1-click-bom/lib/data/countries.json');

const get = function(url, arg, callback, error_callback) {
  var line, notify, timeout, xhr;
  line = arg.line, notify = arg.notify, timeout = arg.timeout;
  if (line == null) {
    line = null;
  }
  if (notify == null) {
    notify = false;
  }
  if (timeout == null) {
    timeout = 60000;
  }
  xhr = new XMLHttpRequest;
  xhr.line = line;
  xhr.open('GET', url, true);
  xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
  xhr.url = url;
  xhr.onreadystatechange = function(event) {
    if (event.target.readyState === 4) {
      if (event.target.status === 200) {
        return callback(event);
      } else {
        return error_callback(event);
      }
    }
  };
  xhr.timeout = timeout;
  xhr.ontimedout = function(event) {
    return error_callback(event);
  };
  return xhr.send();
};


const getLocation = function(callback) {
  var code;
  var used_country_codes = [];
  for (let key in countries_data) {
    code = countries_data[key];
    used_country_codes.push(code);
  }
  const url = 'https://freegeoip.kitnic.it';
  return get(url, {
    timeout: 5000
  }, (function() {
    return function(event) {
      var response;
      response = JSON.parse(event.target.responseText);
      code = response.country_code;
      if (code === 'GB') {
        code = 'UK';
      }
      if (used_country_codes.indexOf(code) < 0) {
        code = 'Other';
      }
      return callback(code);
    };
  })(this), function() {
    return callback('Other');
  });
};


const DirectStores = React.createClass({
  propTypes: {
    items: React.PropTypes.any.isRequired,
    multiplier: React.PropTypes.number.isRequired
  },
  getInitialState: function () {
    if (typeof window != 'undefined'){
      getLocation((code) => {
        this.setState({countryCode: code});
      });
    }
    return {
      countryCode: 'Other'
    };
  },
  getParts: function (retailer) {
    let parts = this.props.items;
    parts = parts.filter(part => {
      return retailer in part.retailers && part.retailers[retailer] != '';
    });
    parts = parts.map( part => {
      return {
        sku: part.retailers[retailer],
        reference: part.reference,
        quantity: Math.ceil(this.props.multiplier * part.quantity)
      };
    }
    );
    return parts;
  },
  digikeyPartRenderer: function (part, index) {
    index++;
    return (
      <span key={`digikeyRenderer${index}`}>
        <input type='hidden' name={`part${index}`} value={part.sku} />
        <input type='hidden' name={`qty${index}`} value={part.quantity} />
        <input type='hidden' name={`cref${index}`} value={part.reference} />
      </span>
      );
  },
  digikey: function (countryCode, parts) {
    const site = digikey_data.sites[digikey_data.lookup[countryCode]];
    return (
      <form
      target="_blank"
      key='DigikeyForm'
      id='DigikeyForm'
      method='POST'
      action={`https${site}/classic/ordering/fastadd.aspx` +
      '?WT.z_cid=ref_kitnic'}>
        { parts.map(this.digikeyPartRenderer) }
      </form>);

  },
  tildeDelimiter: function (part) {
    return part.sku + '~' + part.quantity;
  },
  farnell: function (countryCode, parts) {
    const site = farnell_data.sites[farnell_data.lookup[countryCode]];
    const queryString = parts.map(this.tildeDelimiter).join('~');
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
      );
  },
  newark: function (parts) {
    const queryString = parts.map(this.tildeDelimiter).join('~');
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
      );
  },

  render: function () {
    const digikeyParts = this.getParts('Digikey');
    const farnellParts = this.getParts('Farnell');
    const newarkParts  = this.getParts('Newark');
    return (
      <span>
      {[
        this.digikey(this.state.countryCode, digikeyParts),
        this.farnell(this.state.countryCode, farnellParts),
        this.newark(newarkParts)
      ]}
       </span>
      );
  }
});
module.exports = DirectStores;
