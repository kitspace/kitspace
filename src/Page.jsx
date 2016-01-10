const React         = require('react');
const ReactDOM      = require('react-dom');
const DocumentTitle = require('react-document-title');
const info          = require('./info.json');
const TitleBar      = require('./TitleBar');
const Image    = require('./Image');

var Page = React.createClass({
  render: function () {
    const titleTxt = info.id.split('/').slice(1).join(' / ');
    const site = info.site != '' ? (<a href={info.site} target='_blank'><span className="octicon octicon-link" /> website</a>) : null;
    const repo = info.repo != '' ? (<a href={info.repo} target='_blank'><span className="octicon octicon-repo" /> repo</a>) : null;
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
            <div style={{backgroundColor: '#F6F6F6', padding: 20, borderRadius: 5,  textAlign:'center', maxWidth:700}}>
              <div className=''>
                  <p>{info.description}</p>
              </div>
              <div className='flex-container'>
                <div className=''>{site}</div>
                <div className=''>{repo}</div>
              </div>
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
