const React         = require('react')
const DocumentTitle = require('react-document-title')

const Bom           = require('../bom/bom')
const BoardShowcase = require('./board_showcase')
const Gerbers       = require('./gerbers')
const InfoBar       = require('./info_bar')

const TitleBar      = require('../title_bar')
const FadeImage     = require('../fade_image')
const Readme        = require('../readme')

const info = require('../info.json')

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
              <Bom
                lines={info.bom.lines}
                parts={info.bom.parts}
                tsv={info.bom.tsv}
              />
              <Readme />
            </div>
          </div>
        </div>
      </DocumentTitle>
    )
  },
})

module.exports = Page
