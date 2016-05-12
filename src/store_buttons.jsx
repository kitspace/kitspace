'use strict';
const React            = require('react');
const oneClickBOM      = require('1-click-bom');
const browserVersion   = require('browser-version');
const _                = require('lodash');
const BomInstallPrompt = require('./bom_install_prompt');
const ExtensionCompatibilityPrompt  =
require('./extension_compatibility_prompt');
const InstallExtension = require('./install_extension');


const StoreButtons = React.createClass({
  propTypes: {
    items: React.PropTypes.any
  },
  isExtensionCompatible: function(version) {
    if (typeof navigator == 'undefined')
      return true;
    if (/Mobile/i.test(navigator.userAgent))
      return false;
    return (/Chrome/.test(version) || /Firefox/.test(version));
  },
  getInitialState: function() {
    let adding = {};
    let partsSpecified = {};
    let parts = {};
    const version = browserVersion();
    var onClick = InstallExtension;

    for (let retailer of oneClickBOM.lineData.retailer_list) {
      adding[retailer] = undefined;
      let retailerItems = _.map(this.props.items,
        (item) => item.retailers[retailer]);
      let partCount = retailerItems.reduce((carry, val) => {
        if (val)
          carry++;
        return carry;
      }, 0);
      let summary;
      if (this.props.items.length == partCount){
        summary = 'all specified';
      } else if (partCount == 0) {
        summary = 'none specified';
      } else {
        summary = partCount + '/' + this.props.items.length + ' specified';
      }

      parts[retailer] =
      {
        count: partCount,
        total: this.props.items.length,
        summary: summary
      };

      if (_.every(retailerItems)) {
        partsSpecified[retailer] = 'allPartsSpecified';
      } else if (_.some(retailerItems)) {
        partsSpecified[retailer] = 'somePartsSpecified';
      } else {
        partsSpecified[retailer] = 'noPartsSpecified';
      }
    }
    //waiting to avoid flashing on page load
    if (typeof window != 'undefined'){
      setTimeout(() => {
        this.setState({
          extensionPresence:
            !this.state.extensionWaiting ? 'present' : 'not_present'
        });
      },2000);
    }
    return {
      compatibleBrowser: this.isExtensionCompatible(version),
      extensionInstallLink: onClick,
      adding: adding,
      partsSpecified: partsSpecified,
      parts: parts,
      onClick: onClick,
      extensionWaiting: true,
      extensionPresence: 'unknown'
    };
  },
  componentDidMount: function () {
    //extension communication
    window.addEventListener('message', (event) => {
      if (event.source != window)
        return;
      if (event.data.from == 'extension'){
        this.setState({
          extensionWaiting: false
        });
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
      }
    }, false);
  },
  storeIcon: function(adding, retailer, disabled) {
    const imgHref = `/images/${retailer}${disabled ? '-grey' : ''}.ico`;
    if (adding)
      return (<i className='icon-spin1 animateSpin'></i>);
    return (
      <img
      className='storeIcons'
      key={retailer}
      src={imgHref}
      alt={retailer} />);
  },
  storeButtons: function() {
    const retailers = oneClickBOM.lineData.retailer_list;
    let storeButtons = retailers.map((retailer) => {
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
      let partsInfo = this.state.parts[retailer];

      return (
        <span onClick={onClick}
        title={partsInfo.summary}
        className={storeButtonClass} key={`storeButton-${retailer}`}>
          <div className={storeButtonInnerClass}>
            <div className={retailerIconClass}>
              {this.storeIcon(this.state.adding[retailer],retailer,
               ! anySpecified)}
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
        <BomInstallPrompt
        extensionPresence={this.state.extensionPresence}
        bomInstallLink={this.state.extensionInstallLink}
        compatibleBrowser={this.state.compatibleBrowser}
        />
        <ExtensionCompatibilityPrompt
        compatibleBrowser={this.state.compatibleBrowser} />
        <div className='storeButtons'>
          {this.storeButtons()}
        </div>
      </div>
    );
  }
});

module.exports = StoreButtons;
