const React         = require('react');
const ReactDOM      = require('react-dom');
const DocumentTitle = require('react-document-title');
const TitleBar      = require('./title_bar');
const FadeImage     = require('./fade_image');
const BOM           = require('./bom');

const info    = require('./info.json');
const zipPath = require('./zip-info.json');

var Page = React.createClass({
  getInitialState: function() {
    return {
      viewFrontBoard:1
    }
  },
  swapBoardView: function(e) {
    e.preventDefault();
    const curr = this.state.viewFrontBoard;
    const next = 1 - curr;
    this.setState({
      viewFrontBoard: next
    });
  },
  render: function () {
    const titleTxt = info.id.split('/').slice(1).join(' / ');
    var site;
    var frontBoardClass = 'front-board board-diagram ';
    var backBoardClass = 'back-board board-diagram ';
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

    if (this.state.viewFrontBoard) {
      frontBoardClass += ' selected-board';
    }else{
      backBoardClass += ' selected-board';
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
        <div className="board-container" style={{
          backgroundColor:'#373737'
          , borderRadius: '1em'
        }}
        >
          <img className={frontBoardClass}
            src='images/top.svg'
            style = {{
              width: '50%',
            }}
          />
          <img className={backBoardClass}
            src='images/bottom.svg'
            style = {{
              width: '50%',
            }}
          />
        </div>
        <form className="toggle-board-form" onSubmit={this.swapBoardView}>
          <button className="toggle-board-side">
            View {this.state.viewFrontBoard ? 'back' : 'front'} side
          </button>
        </form>
      <BOM items={info.bom ? info.bom : []} />
      </div>
      </div>
    </DocumentTitle>
    );
  },
});

module.exports = Page
