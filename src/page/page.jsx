const React         = require('react')
const DocumentTitle = require('react-document-title')
const TitleBar      = require('../title_bar')
const BOM           = require('./bom')
const BoardShowcase = require('./board_showcase')
const StoreButtons  = require('./buy_parts')
const info          = require('../info.json')
const Readme        = require('../readme')
const Gerbers       = require('./gerbers')
const FadeImage     = require('../fade_image')
const InfoBar       = require('./info_bar')

var Page = React.createClass({
  render: function () {
    const titleTxt = info.id.split('/').slice(2).join(' / ')
    const subtitleTxt = info.id.split('/').slice(0,2).join(' / ')
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
            <InfoBar info={info} />
            <Gerbers />
            <BoardShowcase>
              <FadeImage src='images/top.svg' />
              <FadeImage src='images/bottom.svg'/>
            </BoardShowcase>
            <StoreButtons items={ info.bom.lines ? info.bom.lines : [] } />
            <Readme />
            <BOM tsv={ info.bom ? info.bom.tsv : '' } />
          </div>
        </div>
      </div>
    </DocumentTitle>
    )
  },
})

module.exports = Page
