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

        Sorry, the <a className='bomPromptLink'
        href='https://1clickbom.com/'>1-click BOM extension</a> is not yet
        available for your browser. Only the Digikey add-to-cart links work
          fully, Farnell and Newark should work but the references will not be
        added as line-notes.

      </div>); } });
module.exports = ExtensionCompatibilityPrompt;
