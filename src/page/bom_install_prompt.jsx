const React = require('react')

const bomInstallPrompt = React.createClass({
  propTypes: {
    extensionPresence: React.PropTypes.string.isRequired,
    bomInstallLink: React.PropTypes.func.isRequired,
    compatibleBrowser: React.PropTypes.bool.isRequired
  },
  render: function(){
    if (this.props.extensionPresence === 'not_present'
      && this.props.compatibleBrowser) {
      return (
      <div className='bomInstallPrompt'>

        Please <a className='bomInstallAnchor'
        onClick={this.props.bomInstallLink}>install the 1-click BOM
        extension</a> to make full use of this feature.

      </div>)
    }
    return (<div></div>)
  }
})
module.exports = bomInstallPrompt
