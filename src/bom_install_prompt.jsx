const React = require('react');

const bomInstallPrompt = React.createClass({
  propTypes: {
    extensionPresence: React.PropTypes.number.isRequired,
    bomInstallLink: React.PropTypes.func.isRequired,
    compatibleBrowser: React.PropTypes.bool.isRequired
  },
  render: function(){
    if (this.props.extensionPresence === -1 && this.props.compatibleBrowser) {
      return (
      <div className='bomInstallPrompt'>
        Please install the <a
        className='bomInstallAnchor'
        onClick={this.props.bomInstallLink}
        >
        1ClickBOM Extension</a> to use this feature
      </div>);
    }
    return (<div></div>);
  }
});
module.exports = bomInstallPrompt;
