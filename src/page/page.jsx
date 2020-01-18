const React = require('react')
const {Helmet} = require('react-helmet')

const BoardShowcase = require('./board_showcase')
const OrderPcbs = require('./order_pcbs')
const InfoBar = require('./info_bar')

const TitleBar = require('../title_bar')
const FadeImage = require('../fade_image')
const BuyParts = require('../buy_parts/buy_parts')
const Readme = require('../readme')
const semantic = require('semantic-ui-react')

const info = require('../info.json')
const description =
  info.summary +
  ' - Shared on Kitspace - Kitspace is a place to share ready to order electronics designs. You can order the right components for this project with a few clicks.'
const metaImage = `https://kitspace.org/boards/${
  info.id
}/images/top-with-background.png`

const {zipPath, folder, width, height} = require('../zip-info.json')

const zipUrl = `https://kitspace.org/${folder}/${zipPath}`

const Page = React.createClass({
  render() {
    const idText = info.id
      .split('/')
      .slice(-1)
      .join(' / ')
    const titleText = `${idText} on Kitspace`
    return (
      <div>
        <Helmet>
          <title>{titleText}</title>
          <meta name="description" content={info.summary} />

          <meta itemprop="name" content={titleText} />
          <meta itemprop="description" content={description} />
          <meta itemprop="image" content={metaImage} />

          <meta property="og:type" content="website" />
          <meta property="og:title" content={titleText} />
          <meta property="og:description" content={description} />
          <meta property="og:image" content={metaImage} />
          <meta property="og:image:width" content={1000} />
          <meta property="og:image:height" content={524} />

          <meta name="twitter:card" content="summary_large_image" />
          <meta name="twitter:title" content={titleText} />
          <meta name="twitter:description" content={description} />
          <meta name="twitter:image" content={metaImage} />
        </Helmet>
        <div className="page">
          <TitleBar route={'/boards/' + info.id} />
          <div className="pageContainer">
            <img style={{display: 'none'}} src="/images/flags.png" />
            <InfoBar info={info} />
            <BoardShowcase zipUrl={zipUrl}>
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
