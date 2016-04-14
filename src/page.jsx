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
    var frontBoardClass = 'frontBoard boardDiagram ';
    var backBoardClass = 'backBoard boardDiagram ';
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
      frontBoardClass += ' selectedBoard';
    }else{
      backBoardClass += ' selectedBoard';
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
          <div className='subtitleText'>
            {subtitleTxt}
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
          <div className="toggleBoardView">
            <button disabled={this.state.viewFrontBoard} className="circuitToggleBtn circuitFrontBtn" onClick={this.frontBoardView}>
              Front View
            </button>
            <button disabled={!this.state.viewFrontBoard} className="circuitToggleBtn circuitBackBtn" onClick={this.backBoardView}>
              Back View
            </button>
          </div>
          <div className="boardShowcase">
            <div className="boardEdge">
            </div>
              <div className="boardContainer" style={{

              }}
              >
                <img className={frontBoardClass}
                  src='images/top.svg'
                />
                <div className="circuitBorderContainer">
                  <div className="circuitBorder">
                  </div>
                </div>
                <img className={backBoardClass}
                  src='images/bottom.svg'
                />
              </div>
            <div className="boardEdge">
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
