const React         = require('react');
const ReactDOM      = require('react-dom');
const DocumentTitle = require('react-document-title');
const TitleBar      = require('./title_bar');
const FadeImage     = require('./fade_image');
const BOM           = require('./bom');

const info    = require('./info.json');
const zipPath = require('./zip-info.json');

var Page = React.createClass({
  render: function () {
    const titleTxt = info.id.split('/').slice(1).join(' / ');
    var site;
    if (info.site == '') {
      site =
        (<div className='disabledSite' title='no website info available'>
          <span className="octicon octicon-link" />website
        </div>);
    }
    else {
      site =
        (<a href={info.site}>
          <span className="octicon octicon-link" /> website
        </a>);
    }
    const repo =
      <a href={info.repo}>
        <span className="octicon octicon-repo" /> repo
      </a>;
    return (
      <DocumentTitle title={titleTxt}><div>
      <div className='Page'>
        <TitleBar>
          <div className='titleText'>
            {titleTxt}
          </div>
        </TitleBar>
          <div className='infoBar'>
            <div className='infoBarInner'>
              <div style={{marginBottom:10}}>{info.description}</div>
              <div className='infoBarLinksContainer'>
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
      </div>
    </DocumentTitle>
    );
  },
});

module.exports = Page
