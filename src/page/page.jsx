const React         = require('react')
const DocumentTitle = require('react-document-title')

const BOM           = require('./bom')
const BoardShowcase = require('./board_showcase')
const StoreButtons  = require('./buy_parts')
const Gerbers       = require('./gerbers')
const InfoBar       = require('./info_bar')

const TitleBar  = require('../title_bar')
const FadeImage = require('../fade_image')
const info      = require('../info.json')
const Readme    = require('../readme')

const Page = React.createClass({
  render() {
    const titleText    = info.id.split('/').slice(2).join(' / ')
    const subtitleText = info.id.split('/').slice(0,2).join(' / ')
    return (
      <DocumentTitle title={`${titleText} - kitnic.it`}>
        <div>
          <div className='page'>
            <TitleBar submissionButton={true}>
              <div className='titleText'>
                {titleText}
              </div>
              <div className='subtitleText'>
                {subtitleText}
              </div>
            </TitleBar>
            <div className="pageContainer">
              <InfoBar info={info} />
              <Gerbers />
              <BoardShowcase>
                <FadeImage src='images/top.svg' />
                <FadeImage src='images/bottom.svg'/>
              </BoardShowcase>
              <StoreButtons items={info.bom.lines} />
              <Readme />
              <BOM tsv={info.bom.tsv} />
            </div>
          </div>
        </div>
      </DocumentTitle>
    )
  },
})

module.exports = Page
