const React         = require('react');
const ReactDOM      = require('react-dom');
const DocumentTitle = require('react-document-title');
const info          = require('./info.json');
const TitleBar      = require('./TitleBar');
const Image    = require('./Image');

var Page = React.createClass({
  render: function () {
    var titleTxt = info.id.split('/').slice(1).join(' / ');
    return (
      <DocumentTitle title={titleTxt}><div>
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
        <div style={{marginLeft:'10%', marginRight:'10%', marginTop:32, marginBottom: 32}}>
          <center>
            <div style={{backgroundColor: '#FAFAFA', padding: 20, borderRadius: 5,  textAlign:'left', maxWidth:700}}>
              <p>{info.description}</p>
              <p>{info.id}</p>
              <p>{info.site}</p>
            </div>
          </center>
        </div>
        <div style={{
          backgroundColor:'#373737'
          , borderRadius: '1em'
        }}
        >
        <img
          src='images/top.svg'
          style = {{
            width: '30%'
          }}
        />
        <img
          src='images/bottom.svg'
          style = {{
            width: '30%'
          }}
        />
        </div>
      </div></DocumentTitle>
    );
  },
});

module.exports = Page
