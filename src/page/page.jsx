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
    const idText = info.id
      .split('/')
      .slice(2)
      .join(' / ')
    const titleText = `${idText} - Kitspace`
    const metaTitle = `${idText} on Kitspace`
    const subtitleText = info.id
      .split('/')
      .slice(0, 2)
      .join(' / ')
    return (
      <div>
        <Helmet>
          <title>{titleText}</title>
          <meta name="description" content={info.summary} />

          <meta itemprop="name" content={metaTitle} />
          <meta itemprop="description" content={info.summary} />
          <meta
            itemprop="image"
            content={`http://meta-tags.preview.kitspace.org/boards/${
              info.id
            }/images/top-large-with-background.png`}
          />

          <meta property="og:url" content="kitspace.org" />
          <meta property="og:type" content="website" />
          <meta property="og:title" content={metaTitle} />
          <meta property="og:description" content={info.summary} />
          <meta
            property="og:image"
            content={`http://meta-tags.preview.kitspace.org/boards/${
              info.id
            }/images/top-large-with-background.png`}
          />
          <meta property="og:image:width" content={800} />
          <meta property="og:image:height" content={600} />

          <meta name="twitter:card" content="summary_large_image" />
          <meta name="twitter:title" content={metaTitle} />
          <meta name="twitter:description" content={info.summary} />
          <meta
            name="twitter:image"
            content={`http://meta-tags.preview.kitspace.org/boards/${
              info.id
            }/images/top-large-with-background.png`}
          />
        </Helmet>
        <div className="page">
          <TitleBar submissionButton={true}>
            <div className="titleText">{idText}</div>
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
