'use strict'
const React          = require('react');
const _              = require('lodash');
const oneClickBOM    = require('1-click-bom');
const browserVersion = require('browser-version');


let BOM = React.createClass({
  getInitialState: function() {
    let adding = {};
    for (let retailer of oneClickBOM.lineData.retailer_list) {
      adding[retailer] = undefined;
    }
    return {
      onClick: function () {
        window.open('//1clickBOM.com', '_self');
      },
      adding: adding,
      fullView: 0
    };
  },
  componentDidMount: function () {
    const version = browserVersion();
    if (/Chrome/.test(version)) {
      this.setState({
        onClick: () => {
          chrome.webstore.install(undefined, undefined, (err) => console.log(err));
        }
      });
    } else if (/Firefox/.test(version)) {
      this.setState({
        onClick: () => {
          window.open(
            '//addons.mozilla.org/firefox/downloads/latest/634060/addon-634060-latest.xpi',
            '_self');
        }
      });
    }
    //extension communication
    window.addEventListener('message', (event) => {
      if (event.source != window)
        return;
      if (event.data.from == 'extension')
        switch (event.data.message) {
          case 'register':
            this.setState({
              onClick: function (retailer) {
                window.postMessage({from:'page', message:'quickAddToCart', value:retailer}, '*');
              }
            });
            break;
          case 'updateAddingState':
            this.setState({
              adding: event.data.value
            });
            break;
        }
    }, false);
  },
  toggleTblView: function (e) {
    e.preventDefault();
    this.setState({
      fullView: this.state.fullView = 1 - this.state.fullView
    });
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
      const iconClass = this.state.adding[retailer] ? 'icon-spin1 animate-spin' : 'icon-basket-3';
      return (
        <th key={`heading-${retailer}`} className='retailerHeading' onClick={this.state.onClick.bind(null,retailer)}>
          {retailer}<span> </span>
          <i style={{fontSize:18}} className={iconClass}></i>
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
    let tblClass = 'responsive';
    let btnText = 'Hide stores';
    if (this.state.fullView === 0){
      tblClass += ' defaultTblView';
      btnText = 'Show stores';
    }
    let storeBtns;
    storeBtns = retailers.map(function(retailer, key){
      let imgHref = '/images/'+retailer+'.ico';
      return (
        <button key={`btn${retailer}`}>
          <img className="storeIcos" key={retailer} src={imgHref} alt={retailer} />
          Buy now
        </button>
        );
    });

    return (
      <div className="bomContainer">
        <div className="storeBtnContainer">
          <div className="storeBtns">
              {storeBtns}
          </div>
        </div>
        <div className="bomToggleContainer">
          <button className="bomToggle" onClick={this.toggleTblView}>
            {btnText}
          </button>
        </div>
        <div className="bomTblContainer">
          <div className="bomTblEdge"> </div>
          <div className="bomTblViewPort">
            <table className={tblClass}>
              <thead>
                <tr>{ headings }</tr>
              </thead>
              <tbody>
                { rows }
              </tbody>
            </table>
          </div>
          <div className="bomTblEdge"> </div>
          </div>
      </div>
    )
  }
});


module.exports = BOM;
