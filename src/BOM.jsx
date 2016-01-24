'use strict'
const React = require('react');
const _ = require('lodash');

let BOM = React.createClass({
  render: function () {

    // Pluck the object keys to use as headers
    const keys = _.keys(_.head(this.props.items));

    let headers = keys.map((item, index) => {
      return ( <td key={index}>{ item }</td> );
    });

    let rows = this.props.items.map((item, index) => {

      let row = keys.map((index) => {
        // TODO retailer display
        if (index !== 'retailers')
          return ( <td key={index}>{ item[index] }</td> );

        return ( <td key={index}>TODO: object</td> );
      });

      return ( <tr key={index}>{ row }</tr> );

    });

    return (
      <table>
        <thead>
          <tr>{ headers }</tr>
        </thead>
        <tbody>
          { rows }
        </tbody>
      </table>
    )
  }
});

module.exports = BOM;
