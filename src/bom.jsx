'use strict';
const React           = require('react');
const _               = require('lodash');
const oneClickBOM     = require('1-click-bom');
const DoubleScrollbar = require('react-double-scrollbar');

let BOM = React.createClass({
  propTypes: {
    items: React.PropTypes.array
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
      return (
        <th key={`heading-${heading}-${index}`} >
          { heading }
        </th> );
    };
    let headings = ['References', 'Qty', 'Description']
    .concat(partNumbers,retailers);
    headings = headings.map(makeHeading);
    let rows = this.props.items.map( (item, rowIndex) => {
      let row = keys.map( (key) => {
        return (
          <td key={`${rowIndex}-${key}`} >
            { item[key] }
          </td> );
      });
      row = row.concat(_.times(partNumberLength, (index) => {
        let partNumber = item.partNumbers[index];
        //color pink if no part numbers at all for this line
        let style = (index === 0 && (partNumber === '' || partNumber == null)) ?
         {backgroundColor:'pink'} : {};
        return (
          <td
            key={`${item.reference}-partNumber-${index}`}
            style={style}
          >
            { partNumber }
          </td>
        );
      }
      ));
      row = row.concat(_.keys(item.retailers).map((key, index) => {
        let style = (item.retailers[key] === '')
        ? {backgroundColor:'pink'} : {};
        return (
          <td
            key={`${item.reference}-${key}-${index}`}
            style={style}
          >
            { item.retailers[key] }
          </td>
        );
      }
      ));
      return (
        <tr
          className={`tr${rowIndex % 2}`}
          key={`bom-tr-${rowIndex}`}
        >
          { row }
        </tr>
      );
    });
    return (
      <div className='bom'>
        <div className='bomTableContainer'>
          <DoubleScrollbar>
            <table className='bomTable'>
              <thead>
                <tr>{ headings }</tr>
              </thead>
              <tbody>
                { rows }
              </tbody>
            </table>
          </DoubleScrollbar>
          </div>
      </div>
    );
  }
});

module.exports = BOM;
