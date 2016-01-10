const React         = require('react');
const ReactDOM      = require('react-dom');
const DocumentTitle = require('react-document-title');
const info          = require('./info.json');
const TitleBar      = require('./TitleBar');

var Page = React.createClass({
  render: function () {
    var title = info.id.split('/').slice(1).join(' / ');
    return (
      <DocumentTitle title={title}>
        <div>
          <TitleBar center/>
          {title}
        </div>
      </DocumentTitle>
    );
  },
});

module.exports = Page
