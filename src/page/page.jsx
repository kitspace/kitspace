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
const description = info.summary + ' - Shared on Kitspace - Kitspace is a place to share ready to order electronics designs. It could be described as a "Thingiverse for electronics".'

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
          <meta itemprop="description" content={description} />
          <meta
            itemprop="image"
            content={`http://meta-tags.preview.kitspace.org/boards/${
              info.id
            }/images/top-with-background.png`}
          />

          <meta property="og:type" content="website" />
          <meta property="og:title" content={metaTitle} />
          <meta property="og:description" content={description} />
          <meta
            property="og:image"
            content={`http://meta-tags.preview.kitspace.org/boards/${
              info.id
            }/images/top-with-background.png`}
          />
          <meta property="og:image:width" content={500} />
          <meta property="og:image:height" content={400} />

          <meta name="twitter:card" content="summary_large_image" />
          <meta name="twitter:title" content={metaTitle} />
          <meta name="twitter:description" content={description} />
          <meta
            name="twitter:image"
            content={`http://meta-tags.preview.kitspace.org/boards/${
              info.id
            }/images/top-with-background.png`}
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
