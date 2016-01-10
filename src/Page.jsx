const React    = require('react');
const ReactDOM = require('react-dom');
const info     = require('./info.json');
const DocumentTitle = require('react-document-title');

var Page = React.createClass({
  render: function () {
    return (
      <DocumentTitle title={info.id.split('/').slice(1).join(' / ')}>
        <div>
          {info.id.split('/').slice(1).join(' / ')}
        </div>
      </DocumentTitle>
    );
  },
});

module.exports = Page
