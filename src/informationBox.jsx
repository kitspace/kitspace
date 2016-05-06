'use strict';
const React = require('react');
const InformationBox = React.createClass({
  propTypes: {
    compatibleBrowser: React.PropTypes.bool.isRequired
  },
  render: function () {
    if (!this.props.compatibleBrowser)
      return;
    return (
      <div className='informationBox'>

      </div>
    );
  }
});
module.exports = InformationBox;