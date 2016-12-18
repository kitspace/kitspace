const React         = require('react')
const DocumentTitle = require('react-document-title')
const TitleBar      = require('./title_bar')
const BOM           = require('./bom')
const BoardShowcase = require('./board_showcase')
const StoreButtons  = require('./buy_parts')
const info          = require('./info.json')
const Readme        = require('./readme')

var Page = React.createClass({
  render: function () {
    const titleTxt = info.id.split('/').slice(2).join(' / ')
    const subtitleTxt = info.id.split('/').slice(0,2).join(' / ')
    var site
    if (info.site == '') {
      site =
        (<div className='disabledSite' title='no website info available'>
          <span className="octicon octicon-link" />website
        </div>)
    }
    else {
      site =
        (<a href={info.site}>
          <span className="octicon octicon-link" /> website
        </a>)
    }
    const repo =
      <a href={info.repo}>
        <span className="octicon octicon-repo" /> repo
      </a>
    return (
      <DocumentTitle title={`${titleTxt} - kitnic.it`}>
      <div>
        <div className='page'>
          <TitleBar submissionButton={true}>
            <div className='titleText'>
              {titleTxt}
            </div>
            <div className='subtitleText'>
              {subtitleTxt}
            </div>
          </TitleBar>
          <div className="pageContainer">
            <div className='infoBar'>
              <div className='infoBarInner'>
                <div className='infoBarSummary'>{info.summary}</div>
                <div className='infoBarLinksContainer'>
                  <div className='infoBarLinks'>{site}</div>
                  <div className='infoBarLinks'>{repo}</div>
                </div>
              </div>
            </div>
            <BoardShowcase />
            <StoreButtons items={ info.bom.lines ? info.bom.lines : [] } />
            <Readme />
            <BOM data={ info.bom ? info.bom : [] } />
          </div>
        </div>
      </div>
    </DocumentTitle>
    )
  },
})

module.exports = Page
