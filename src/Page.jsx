const React         = require('react');
const ReactDOM      = require('react-dom');
const DocumentTitle = require('react-document-title');
const info          = require('./info.json');
const TitleBar      = require('./TitleBar');

var Page = React.createClass({
  render: function () {
    var titleTxt = info.id.split('/').slice(1).join(' / ');
    return (
      <DocumentTitle title={titleTxt}>
        <TitleBar>
          <div style={{
              color: 'white'
              , width: '100%'
              , textAlign: 'center'
              , verticalAlign: ' middle'
              , lineHeight: '60px'
              , fontSize: 24
              , borderRadius: '5px'
             }}
          >
            {titleTxt}
          </div>
        </TitleBar>
      </DocumentTitle>
    );
  },
});

module.exports = Page
