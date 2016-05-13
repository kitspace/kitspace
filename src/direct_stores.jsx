'use strict';
const React = require('react');
const DirectStores = React.createClass({
  propTypes: {
    items: React.PropTypes.any.isRequired
  },
  getInitialState: function () {
    return {
      storeForms: {
        Digikey: this.digikey(this.getParts('Digikey')) ,
        Farnell: this,
        Newark: ''
      }
    };
  },
  digikey: function (parts) {

  },
  farnell: function () {

  },
  newark: function () {

  },
  getParts: function (retailer) {
    let parts = this.props.items;
    parts = parts.filter( part => retailer in part.retailers );
    parts = parts.map( part => {
      return {
        sku: part.partNumbers[0],
        reference: part.reference,
        quantity: part.quantity
      };
    }
    );
    return parts;
  },
  render: function () {
    return (this.state.storeForms);
  }
});
module.exports = DirectStores;
