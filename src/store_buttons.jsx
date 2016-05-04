'use strict';
const React           = require('react');
const oneClickBOM     = require('1-click-bom');
const browserVersion  = require('browser-version');
const _               = require('lodash');

const StoreButtons = React.createClass({
  getInitialState: function() {
    let adding = {};
    let partsSpecified = {};
    for (let retailer of oneClickBOM.lineData.retailer_list) {
      adding[retailer] = undefined;
      let retailerItems = _.map(this.props.items, (item) => item.retailers[retailer])
      if (_.every(retailerItems)) {
        partsSpecified[retailer] = 'allPartsSpecified';
      } else if (_.some(retailerItems)) {
        partsSpecified[retailer] = 'somePartsSpecified';
      } else {
        partsSpecified[retailer] = 'noPartsSpecified';
      }
    }
    return {
      onClick: function () {
        window.open('//1clickBOM.com', '_self');
      },
      adding: adding,
      partsSpecified: partsSpecified
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
                window.postMessage({
                  from:'page',
                  message:'quickAddToCart',
                  value:retailer}, '*');
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
  storeIcon: function(adding, retailer, disabled) {
    const imgHref = `/images/${retailer}${disabled ? '-grey' : ''}.ico`;
    if (adding)
      return (<i className='icon-spin1 animate-spin'></i>);
    return (<img className='storeIcons' key={retailer} src={imgHref} alt={retailer} />);
  },
  storeButtons: function() {
    const retailers = oneClickBOM.lineData.retailer_list;
    let storeButtons = retailers.map((retailer, key) => {
      let storeButtonInnerClass =
        'storeButtonInner ' + this.state.partsSpecified[retailer];
      let storeButtonClass  = 'storeButton';
      let retailerIconClass = 'retailerIcon';
      let retailerTextClass = 'retailerText';
      let anySpecified =
        this.state.partsSpecified[retailer] === 'allPartsSpecified'
        || this.state.partsSpecified[retailer] === 'somePartsSpecified';
      let onClick = '';
      if (anySpecified) {
        onClick = this.state.onClick.bind(null,retailer);
      }
      return (
        <span onClick={onClick}
        title={`Add parts to ${retailer} cart`}
        className={storeButtonClass} key={`storeButton-${retailer}`}>
          <div className={storeButtonInnerClass}>
            <div className={retailerIconClass}>
              {this.storeIcon(this.state.adding[retailer],retailer, ! anySpecified)}
            </div>
            <div className={retailerTextClass}>{retailer}</div>
          </div>
        </span>
      );
    });
    storeButtons.unshift();
    return storeButtons;
  },
	render: function() {
		return (
		<div className='storeButtonContainer'>
      <div className='storeContainerLogo' key='storeContainerLogo'>
        <i className='icon-basket-3'></i>
        Buy Parts
      </div>
      <div className='storeButtons'>
        {this.storeButtons()}
      </div>
    </div>
		);
	}
});

module.exports = StoreButtons;