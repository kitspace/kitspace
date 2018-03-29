const React = require('react')
const {Helmet} = require('react-helmet')

const BoardShowcase = require('./board_showcase')
const OrderPcbs = require('./order_pcbs')
const InfoBar = require('./info_bar')

const TitleBar = require('../title_bar')
const FadeImage = require('../fade_image')
const BuyParts = require('../buy_parts/buy_parts')
const Readme = require('../readme')

const info = require('../info.json')

const Page = React.createClass({
  render() {
    const titleText = info.id
      .split('/')
      .slice(2)
      .join(' / ')
    const subtitleText = info.id
      .split('/')
      .slice(0, 2)
      .join(' / ')
    return (
      <div>
        <Helmet>
          <title>{`${titleText} - Kitspace`}</title>
        </Helmet>
        <div className="page">
          <TitleBar submissionButton={true}>
            <div className="titleText">{titleText}</div>
            <div className="subtitleText">{subtitleText}</div>
          </TitleBar>
          <div className="pageContainer">
            <InfoBar info={info} />
            <BoardShowcase>
              <FadeImage src="images/top.svg" />
              <FadeImage src="images/bottom.svg" />
            </BoardShowcase>
            <OrderPcbs />
            <BuyParts lines={info.bom.lines} parts={info.bom.parts} />
            <Readme />
          </div>
        </div>
      </div>
    )
  }
})

module.exports = Page
