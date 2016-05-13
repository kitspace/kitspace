'use strict';
const React = require('react');
const DirectStores = React.createClass({
  propTypes: {
    items: React.PropTypes.any.isRequired
  },
  getInitialState: function () {
    return {
      storeForms: [
        this.digikey(this.getParts('Digikey')),
        this.farnell(this.getParts('Farnell')),
        this.newark(this.getParts('Newark'))
      ]
    };
  },
  getParts: function (retailer) {
    let parts = this.props.items;
    parts = parts.filter( part => retailer in part.retailers );
    parts = parts.map( part => {
      return {
        sku: part.retailers[retailer],
        reference: part.reference,
        quantity: part.quantity
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
  digikey: function (parts) {
    return (
      <form
      target="_blank"
      key='DigikeyForm'
      id='DigikeyForm'
      method='POST'
      action={'https://www.digikey.com/classic/ordering/fastadd.aspx' +
      '?WT.z_cid=ref_kitnic'}>
        { parts.map(this.digikeyPartRenderer) }
      </form>);

  },
  tildeDelimiter: function (part) {
    return part.sku + '~' + part.quantity;
  },
  farnell: function (parts) {
    const queryString = parts.map(this.tildeDelimiter).join('~');
    return (
      <form
      target="_blank"
      key='FarnellForm'
      id='FarnellForm'
      method='GET'
      action='http://uk.farnell.com/jsp/extlink.jsp' >
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
      action='http://www.newark.com/jsp/extlink.jsp' >
        <input type='hidden' name='CMP' value='ref_kitnic' />
        <input type='hidden' name='action' value='buy' />
        <input type='hidden' name='product' value={queryString} />
      </form>
      );
  },

  render: function () {
    return (
      <span>
        {this.state.storeForms}
      </span>
      );
  }
});
module.exports = DirectStores;
