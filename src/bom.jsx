'use strict'
const React          = require('react');
const _              = require('lodash');
const oneClickBOM    = require('1-click-bom');
const browserVersion = require('browser-version');
console.log(browserVersion());

let BOM = React.createClass({
  getInitialState: function() {
    return {
      browser: null
    };
  },

  componentDidMount: function () {
    const version = browserVersion();
    if (/Chrome/.test(version)) {
      this.setState({browser: 'Chrome'})
    } else if (/Firefox/.test(version)) {
      this.setState({browser: 'Firefox'})
    }
  },

  render: function () {

    //get rid of this once proper BOMs are made a requirement and enforced
    //much earlier
    if (this.props.items.length === 0) {
      return (<div>{'no BOM yet'}</div>);
    }

    const keys = ['reference', 'quantity', 'description'];
    const retailers = oneClickBOM.lineData.retailer_list;
    const partNumberLength = _.max(this.props.items.map((item) => {
      return item.partNumbers.length;
    }).concat(1));
    const partNumbers = _.times(partNumberLength, _.constant('Part Number'));

    const makeHeading = (heading, index) => {
      return ( <td key={`heading-${heading}-${index}`}>{heading}</td> );
    };

    let headings = ['References', 'Qty', 'Description'].map(makeHeading);
    headings = headings.concat(partNumbers.map(makeHeading));
    headings = headings.concat(retailers.map(makeHeading));

    let rows = this.props.items.map((item, rowIndex) => {

      let row = keys.map((key) => {
        return ( <td key={`${rowIndex}-${key}`}>{ item[key] }</td> );
      });

      row = row.concat(_.times(partNumberLength, (index) => {
        let partNumber = item.partNumbers[index];
        let style = {};

        //color pink if no part numbers at all for this line
        if (index === 0 && (partNumber === '' || partNumber == null)) {
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
          <tr>{ headings }</tr>
        </thead>
        <tbody>
          { rows }
        </tbody>
      </table>
    )
  }
});

module.exports = BOM;
