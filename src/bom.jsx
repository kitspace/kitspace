'use strict';
const React           = require('react');
const _               = require('lodash');
const oneClickBOM     = require('1-click-bom');
const DoubleScrollbar = require('react-double-scrollbar');
const { table, thead, tbody, tr, th, td } =
  require('react-hyperscript-helpers');

function tsvToTable(tsv) {
  const lines = tsv.split('\n');
  const heading = lines[0].split('\t');
  let headingJSX = heading.map((text) => {
    return th(text);
  });
  headingJSX = thead([tr(headingJSX)])
  const bodyJSX = tbody(lines.slice(1).map((line) => {
    line = line.split('\t');
    return tr(line.map((text) => {
      return td(text);
    }));
  }));
  return table('.bomTable', [headingJSX, bodyJSX]);
}

let BOM = React.createClass({
  propTypes: {
    data: React.PropTypes.object.isRequired
  },
  render: function () {
    //get rid of this once proper BOMs are made a requirement and enforced
    //much earlier
    if (this.props.data.lines.length === 0) {
      return (<div>{'no BOM yet'}</div>);
    }

    const keys = ['reference', 'quantity', 'description'];
    const retailers = oneClickBOM.lineData.retailer_list;
    const partNumberLength = _.max(this.props.data.lines.map((line) => {
      return line.partNumbers.length;
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
    let rows = this.props.data.lines.map( (line, rowIndex) => {
      let row = keys.map( (key) => {
        return (
          <td key={`${rowIndex}-${key}`} >
            { line[key] }
          </td> );
      });
      row = row.concat(_.times(partNumberLength, (index) => {
        let partNumber = line.partNumbers[index];
        //color pink if no part numbers at all for this line
        let style = (index === 0 && (partNumber === '' || partNumber == null)) ?
         {backgroundColor:'pink'} : {};
        return (
          <td
            key={`${line.reference}-partNumber-${index}`}
            style={style}
          >
            { partNumber }
          </td>
        );
      }
      ));
      row = row.concat(_.keys(line.retailers).map((key, index) => {
        let style = (line.retailers[key] === '')
        ? {backgroundColor:'pink'} : {};
        return (
          <td
            key={`${line.reference}-${key}-${index}`}
            style={style}
          >
            { line.retailers[key] }
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
    let table = tsvToTable(this.props.data.tsv);
    console.log(table);
    return (
      <div className='bom'>
        <div className='bomTableContainer'>
          <DoubleScrollbar>
          {table}
          </DoubleScrollbar>
          </div>
      </div>
    );
  }
});

module.exports = BOM;
