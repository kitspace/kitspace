const React    = require('react');
const ReactDOM = require('react-dom');
const info     = require('./info.json');

var Page = React.createClass({
  render: function () {
    return (
      <div>
      {info.id}
      </div>
    );
  },
});

module.exports = Page
