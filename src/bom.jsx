'use strict'
const React = require('react');
const _ = require('lodash');

let BOM = React.createClass({
  render: function () {

    // Pluck the object keys to use as headers
    const keys = _.keys(this.props.items[0]);
    const retailers = _.keys(this.props.items[1].retailers)

    let headers = keys.concat(retailers).map((item, index) => {
      if (item !== 'retailers' && item !== 'row') {
        return ( <td key={`header-${index}`}>{ item }</td> );
      }
    });

    let rows = this.props.items.map((item, index) => {

      let row = keys.map((key) => {
        if (key !== 'retailers' && key !== 'row') {
            return ( <td key={key}>{ item[key] }</td> );
        }
      });
      row = row.concat(retailers.map((key) => {
        return ( <td key={`${item}-${key}`}>{ item.retailers[key] }</td> );
      }));

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
