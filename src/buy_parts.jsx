'use strict';
const React            = require('react');
const oneClickBOM      = require('1-click-bom');
const browserVersion   = require('browser-version');
const BomInstallPrompt = require('./bom_install_prompt');
const ExtensionCompatibilityPrompt  =
require('./extension_compatibility_prompt');
const InstallExtension = require('./install_extension');
const DirectStores     = require('./direct_stores');


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
      let retailerItems = this.props.items.map((item) => {
        return item.retailers[retailer];
      });
      let partCount = retailerItems.reduce((carry, val) => {
        if (val)
          carry++;
        return carry;
      }, 0);
      let summary;
      if (this.props.items.length == partCount){
        summary = 'All parts specified';
        partsSpecified[retailer] = 'allPartsSpecified';
      } else if (partCount == 0) {
        summary = 'No parts specified';
        partsSpecified[retailer] = 'noPartsSpecified';
      } else {
        summary = `${partCount}/${this.props.items.length} parts specified`;
        partsSpecified[retailer] = 'somePartsSpecified';
      }

      parts[retailer] =
      {
        count: partCount,
        total: this.props.items.length,
        summary: summary
      };

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
      extensionPresence: 'unknown',
      buyMultiplier: 1,
      buyAddPercent: 10
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
            onClick: (retailer) => {
              window.postMessage({
                from:'page',
                message:'quickAddToCart',
                value:{
                  retailer: retailer,
                  multiplier: this._getMultiplier()
                }}, '*');
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
      let onClick;
      if (anySpecified) {
        onClick = this.state.onClick.bind(null,retailer);
      }
      let partsInfo = this.state.parts[retailer];

      //if the extension is not here fallback to direct submissions
      if ((!this.state.compatibleBrowser
        || this.state.extensionPresence != 'present')
        && typeof document !== 'undefined'
        && document.getElementById(retailer + 'Form') !== null) {
        onClick = () => {
          document.getElementById(retailer + 'Form').submit();
        };
      }

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

  _getMultiplier: function () {
    const multi = this.state.buyMultiplier;
    const percent = this.state.buyAddPercent;
    return multi + (multi * (percent / 100));
  },

  _quantity: function () {
    return (
      <form id='quantityContainer' noValidate>
        <div>
          <span
          className='notSelectable'
          style={{fontWeight:'bold', marginRight:5}}>
            {'x'}
          </span>
          <input
          type='number'
          min={1}
          value={this.state.buyMultiplier}
          onChange={(e) => {
            var v = parseFloat(e.target.value);
            if (isNaN(v) || v < 1) {
              v = 1;
            }
            this.setState({buyMultiplier: v});
          }}
          />
        </div>
        <span
        className='notSelectable'
        style={{fontSize:'2em', marginLeft:10, marginRight:10}}>
          {' + '}
        </span>
        <div>
          <input
          type='number'
          min={0}
          step={10}
          value={this.state.buyAddPercent}
          onChange={(e) =>{
            var v = parseFloat(e.target.value);
            if (isNaN(v) || v < 0) {
              v = 0;
            }
            this.setState({buyAddPercent: v});
          }}
          />
          <span className='notSelectable' style={{marginLeft:5}}>{'%'}</span>
        </div>
      </form>);
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
        {this._quantity()}
        <DirectStores
        multiplier={this._getMultiplier()}
        items={this.props.items} />
        <div className='storeButtons'>
          {this.storeButtons()}
        </div>
      </div>
    );
  }
});

module.exports = StoreButtons;
