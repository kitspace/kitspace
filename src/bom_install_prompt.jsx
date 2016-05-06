const React = require('react');

const bomInstallPrompt = React.createClass({
  propTypes: {
    extensionPresence: React.PropTypes.number.isRequired
  },
  render: function(){
    if (this.props.extensionPresence === -1) {
      return (
      <div className='bomInstallPrompt'>
        Please install the <a
        className='bomInstallAnchor'
        href='https://1clickbom.com/'
        >
        1ClickBOM Extension</a> to use this feature
      </div>);
    }
    return (<div></div>);
  }
});
module.exports = bomInstallPrompt;