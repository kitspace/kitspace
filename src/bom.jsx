'use strict'
const React = require('react');
const _ = require('lodash');

let BOM = React.createClass({
  render: function () {

    //get rid of this once proper BOMs are made a requirement and enforced
    //much earlier
    if (this.props.items.length === 0) {
      return (<div>{'no BOM yet'}</div>);
    }

    // Pluck the object keys to use as headers
    const keys             = _.keys(this.props.items[0]);
    const retailers        = _.keys(this.props.items[1].retailers);
    const partNumberLength = _.max(this.props.items.map((item) => {
      item.partNumbers.length
    }).concat(1));
    const partNumbers      = _.times(partNumberLength, _.constant('Part Numbers'));

    let headers = keys
      .concat(partNumbers)
      .concat(retailers)
      .map((key, index) => {
        if (key !== 'retailers' && key !== 'row' && key !== 'partNumbers') {
          return ( <td key={`header-${index}`}>{ _.startCase(key) }</td> );
        }
      });

    let rows = this.props.items.map((item, rowIndex) => {

      let row = keys.map((key) => {
        if (key !== 'retailers' && key !== 'row' && key !== 'partNumbers') {
          return ( <td key={`${rowIndex}-${key}`}>{ item[key] }</td> );
        }
      });

      row = row.concat(_.times(partNumberLength, (index) => {
        let partNumber = item.partNumbers[index];
        let style = {};
        //color pink if no part numbers at all for this line
        if (index == 0 && partNumber === '' || partNumber == null) {
          style = {backgroundColor:'pink'};
        }
        return (
          <td key={`${item.reference}-partNumber-${index}`} style={style}>
            { partNumber }
          </td>
        );
      }));

      row = row.concat(_.keys(item.retailers).map((key, index) => {
        let style = {};
        if (item.retailers[key] === '') {
          style = {backgroundColor:'pink'};
        }
        return (
          <td key={`${item.reference}-${key}-${index}`} style={style}>
            { item.retailers[key] }
          </td>
        );
      }));

      return ( <tr className={`tr-${rowIndex % 2}`} key={`bom-tr-${rowIndex}`}>{ row }</tr> );

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
