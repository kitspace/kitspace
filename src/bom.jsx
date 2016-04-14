'use strict'
const React          = require('react');
const _              = require('lodash');
const oneClickBOM    = require('1-click-bom');
const browserVersion = require('browser-version');


let BOM = React.createClass({
  getInitialState: function() {
    return {
      onClick: function () {
        window.open('//1clickBOM.com', '_self');
      }
    };
  },
  componentDidMount: function () {
    const version = browserVersion();
    if (/Chrome/.test(version)) {
      this.setState({onClick: () => chrome.webstore.install(undefined, undefined, (err) => console.log(err))});
    } else if (/Firefox/.test(version)) {
      this.setState({onClick: () => window.open('//addons.mozilla.org/firefox/downloads/latest/634060/addon-634060-latest.xpi', '_self')})
    }
    if (typeof window !== undefined) {
      //for communicating with the extension
      window.setExtensionLinks = () => {
        this.setState({
          onClick: function (retailer) {
            window.postMessage({type:'FromPage', retailer:retailer}, '*');
          }
        })
      }
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
      return ( <th key={`heading-${heading}-${index}`}>{heading}</th> );
    };

    let headings = ['References', 'Qty', 'Description'].map(makeHeading);
    headings = headings.concat(partNumbers.map(makeHeading));

    const makeRetailerHeading = (retailer, index) => {
      return (
        <th key={`heading-${retailer}`} className='retailerHeading' onClick={this.state.onClick.bind(null,retailer)}>
          {retailer}<span> </span>
          <i className="fa fa-cart-plus fa-lg"></i>
        </th>
      );
    };

    headings = headings.concat(retailers.map(makeRetailerHeading));

    let rows = this.props.items.map((item, rowIndex) => {

      let row = keys.map((key) => {
        return ( <td data-th={key.charAt(0).toUpperCase() + key.slice(1)} key={`${rowIndex}-${key}`}>{ item[key] }</td> );
      });

      row = row.concat(_.times(partNumberLength, (index) => {
        let partNumber = item.partNumbers[index];
        let style = {};

        //color pink if no part numbers at all for this line
        if (index === 0 && (partNumber === '' || partNumber == null)) {
          style = {backgroundColor:'pink'};
        }

        return (
          <td data-th="Part Number" key={`${item.reference}-partNumber-${index}`} style={style}>
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
          <td data-th={key} key={`${item.reference}-${key}-${index}`} style={style}>
            { item.retailers[key] }
          </td>
        );
      }));

      return ( <tr className={`tr-${rowIndex % 2}`} key={`bom-tr-${rowIndex}`}>{ row }</tr> );

    });

    return (
      <table className="responsive">
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
