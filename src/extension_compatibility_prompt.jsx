'use strict';
const React = require('react');
const ExtensionCompatibilityPrompt = React.createClass({
  propTypes: {
    compatibleBrowser: React.PropTypes.bool.isRequired
  },
  render: function () {
    if (this.props.compatibleBrowser)
      return null;
    return (
      <div className='extensionCompatibilityPrompt'>
        Sorry the <a
        className='bomPromptLink'
        href='https://1clickbom.com/'>1-Click BOM
        </a> extension is not compatible with this device.
      </div>
    );
  }
});
module.exports = ExtensionCompatibilityPrompt;