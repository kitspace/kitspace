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
    let headerLength = this.columnCount();
    let columnSettings = _.range(0, headerLength).map(()=> 0);
    return {
      onClick: function () {
        window.open('//1clickBOM.com', '_self');
      },
      adding: adding,
      fullView: 0,
      columnsContract:columnSettings,
      columnsGrowWidth:columnSettings
    };
  },
  columnCount: function () {
    return 3+oneClickBOM.lineData.retailer_list.length + _.max(this.props.items.map((item) => {
      return item.partNumbers.length;
    }).concat(1));
  },
  columnGrowUpdate: function (offset) {
    let tds = document.querySelectorAll('table.responsive tr td:nth-child('+(parseInt(offset)+1)+')');
    tds = [...tds];
    let widths = 0;
    if (tds.length){
      widths = tds.map(function(elem, key){
          return elem.scrollWidth;
      });
    }
    return {max: _.max(widths), offset: offset };
  },
  componentDidUpdate: function () {
    // let grow = this.columnGrowUpdate();
    // if (grow.offset !== false){
    //   let th = document.getElementsByTagName('th');
    //   th = [...th];
    //   th.map(function(elem){
    //     if (grow.offset == elem.getAttribute('data-offset')){
    //       if (elem.offsetWidth != grow.max){
    //         let newCols = this.state.columnsGrowWidth;
    //         newCols[grow.offset] = grow.max;
    //         this.setState({
    //           columnsGrowWidth:newCols
    //         });
    //       }
    //     }
    //   }.bind(this));
    // }
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
  toggleColumnExpand: function(offset, headingsLength) {
    let newColumns = _.range(0, headingsLength).map(()=> 0);
    newColumns[offset] = 1;
    let newGrow = _.range(0, headingsLength).map(()=> 0);
    newGrow[offset] = this.columnGrowUpdate(offset).max;
    this.setState({
      columnsContract:newColumns,
      columnsGrowWidth:newGrow
    });
  },
  toggleColumnEnabled: function(offset){
    return this.state.columnsContract[offset];
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
    let tdClasses = function(offset) {
      return (this.toggleColumnEnabled(offset))?'expandedTd expandedTd'+offset:'';
    }.bind(this);
    const makeHeading = function(heading, index, headingsLength) {
      let width = this.state.columnsGrowWidth[index];
      let style = (width !== 0) ? {width:width+'px'} : {width:'auto'};
      return ( <th style={style} className={tdClasses(index)} data-offset={index} key={`heading-${heading}-${index}`}>
          <label onClick={this.toggleColumnExpand.bind(null,index,headingsLength)} >
            {heading}
            <input title="Expand details for this column" type="radio" name="expand-cols" />
          </label>
        </th> );
    }.bind(this);
    let headings = ['References', 'Qty', 'Description'].concat(partNumbers,retailers);
    headings = headings.map(_.partial(makeHeading,_,_,headings.length));
    let rows = this.props.items.map((item, rowIndex) => {

      let row = keys.map((key,index) => {
        return ( <td data-offset={index} className={tdClasses(index)} data-th={key.charAt(0).toUpperCase() + key.slice(1)} key={`${rowIndex}-${key}`}>{ item[key] }</td> );
      });

      row = row.concat(_.times(partNumberLength, _.partial((index, initIndex) => {
        let partNumber = item.partNumbers[index];
        let style = {};

        //color pink if no part numbers at all for this line
        if (index === 0 && (partNumber === '' || partNumber == null)) {
          style = {backgroundColor:'pink'};
        }

        return (
          <td data-offset={initIndex+index} className={tdClasses(initIndex+index)} data-th="Part Number" key={`${item.reference}-partNumber-${index}`} style={style}>
            { partNumber }
          </td>
        );
      },_,row.length)
      ));

      row = row.concat(_.keys(item.retailers).map(_.partial((key, index, initIndex) => {
        let style = {};
        if (item.retailers[key] === '') {
          style = {backgroundColor:'pink'};
        }
        return (
          <td data-offset={initIndex+index} className={tdClasses(initIndex+index)} data-th={key} key={`${item.reference}-${key}-${index}`} style={style}>
            { item.retailers[key] }
          </td>
        );
      }, _, _, row.length)
      ));

      return ( <tr className={`tr-${rowIndex % 2}`} key={`bom-tr-${rowIndex}`}>{ row }</tr> );

    });
    let tblClass = 'responsive';
    let btnText = 'Hide details';
    if (this.state.fullView === 0){
      tblClass += ' defaultTblView';
      btnText = 'Show details';
    }
    let storeBtns;
    storeBtns = retailers.map(function(retailer, key){
      let imgHref = '/images/'+retailer+'.ico';
      let iconClass = this.state.adding[retailer] ? 'icon-spin1 animate-spin' : 'icon-basket-3';
      return (
        <button onClick={this.state.onClick.bind(null,retailer)} className="storeButtons" key={`btn${retailer}`}>
            <div className="storeButtonInner">
              <div>
                <img className="storeIcos" key={retailer} src={imgHref} alt={retailer} />{retailer}
              </div>
              <div>
                <i style={{fontSize:18}} className={iconClass}></i>
                Buy now
              </div>
          </div>
        </button>
        );
    }.bind(this));

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
          </div>
      </div>
    )
  }
});


module.exports = BOM;
