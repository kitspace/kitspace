const React         = require('react');
const ReactDOM      = require('react-dom');
const DocumentTitle = require('react-document-title');
const TitleBar      = require('./TitleBar');
const FadeImage     = require('./FadeImage');
const BOM           = require('./BOM');
const TitleBar      = require('./title_bar');
const FadeImage     = require('./fade_image');

const info    = require('./info.json');
const zipPath = require('./zip-info.json');

const style = {
  disabledSite: {
    color:'grey',
    IeUserSelect:'none',
    WebkitUserSelect:'none',
    MozUserSelect:'none',
    cursor:'default'
  },

  titleText: {
    color: 'white',
    width: '100%',
    textAlign: 'center',
    verticalAlign: ' middle',
    lineHeight: '60px',
    fontSize: 24,
    borderRadius: '5px'
  },

  infoBar: {padding: 20, marginTop:10},

  infoBarInner: {
    display: 'flex',
    flexFlow: 'row wrap',
    justifyContent: 'space-around'
  },

  infoBarLinksContainer: {
    display: 'flex',
    flexFlow: 'row wrap',
    justifyContent: 'space-around',
    flexGrow:2
  }
}

var Page = React.createClass({


  render: function () {
    const titleTxt = info.id.split('/').slice(1).join(' / ');
    var site;
    if (info.site == '') {
      site =
        (<div style={style.disabledSite} title='no website info available'>
          <span className="octicon octicon-link" />website
        </div>);
    }
    else {
      site =
        (<a href={info.site} target='_blank'>
          <span className="octicon octicon-link" /> website
        </a>);
    }
    const repo =
      <a href={info.repo} target='_blank'>
        <span className="octicon octicon-repo" /> repo
      </a>;
    return (
      <DocumentTitle title={titleTxt}><div>
        <TitleBar>
          <div style={style.titleText}>
            {titleTxt}
          </div>
        </TitleBar>
          <div style={style.infoBar}>
            <div style={style.infoBarInner}>
              <div style={{marginBottom:10}}>{info.description}</div>
              <div style={style.infoBarLinksContainer}>
                <div>{site}</div>
                <div>{repo}</div>
                <div>
                  <a href={zipPath}>
                    <span className="octicon octicon-circuit-board" /> gerbers
                  </a>
                </div>
              </div>
            </div>
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
      <BOM items={info.bom ? info.bom : []} />
      </div>
    </DocumentTitle>
    );
  },
});

module.exports = Page
