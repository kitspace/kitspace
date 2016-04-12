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
  frontBoardView: function(e) {
    e.preventDefault();
    this.setState({
      viewFrontBoard:1
    });
  },
  backBoardView: function(e) {
    e.preventDefault();
    this.setState({
      viewFrontBoard:0
    });
  },
  render: function () {
    const titleTxt = info.id.split('/').slice(2).join(' / ');
    const subtitleTxt = info.id.split('/').slice(0,2).join(' / ');
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
      <DocumentTitle title={`${titleTxt} - kitnic.it`}><div>
      <div className='Page'>
        <TitleBar>
          <div className='titleText'>
            {titleTxt}
          </div>
          <div className='subtitleText'>
            {subtitleTxt}
          </div>
        </TitleBar>
          <div className='infoBar'>
            <div className='infoBarInner'>
              <div className='infoBarDescription'>{info.description}</div>
              <div className='infoBarLinksContainer'>
                <div className='infoBarLinks'>{site}</div>
                <div className='infoBarLinks'>{repo}</div>
                <div className='infoBarLinks'>
                  <a href={zipPath}>
                    <span className="octicon octicon-circuit-board" /> gerbers
                  </a>
                </div>
              </div>
            </div>
          </div>
          <div className="toggle-board-view">
            <button disabled={this.state.viewFrontBoard} className="circuit-toggle-btn circuit-front-btn" onClick={this.frontBoardView}>
              Front
            </button>
            <button disabled={!this.state.viewFrontBoard} className="circuit-toggle-btn circuit-back-btn" onClick={this.backBoardView}>
              Back
            </button>
          </div>
          <div className="board-showcase">
            <div className="board-edge">
            </div>
              <div className="board-container" style={{

              }}
              >
                <img className={frontBoardClass}
                  src='images/top.svg'
                />
                <div className="circuit-border-container">
                  <div className="circuit-border">
                  </div>
                </div>
                <img className={backBoardClass}
                  src='images/bottom.svg'
                />
              </div>
            <div className="board-edge">
            </div>

        </div>
      <BOM items={info.bom ? info.bom : []} />
      </div>
      </div>
    </DocumentTitle>
    );
  },
});

module.exports = Page
