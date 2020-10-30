const React = require('react')
const createClass = require('create-react-class')
const semantic = require('semantic-ui-react')
const {Helmet} = require('react-helmet')

const BoardShowcase = require('./board_showcase')
const OrderPcbs = require('./order_pcbs')
const InfoBar = require('./info_bar')
const BoardExtrasMenu = require('./board_extras_menu')

const TitleBar = require('../title_bar')
const FadeImage = require('../fade_image')
const BuyParts = require('../buy_parts/buy_parts')
const Readme = require('../readme')

const info = require('../info.json')
const description =
  info.summary +
  ' - Shared on Kitspace - Kitspace is a place to share ready to order electronics designs. You can order the right components for this project with a few clicks.'
const metaImage = `https://kitspace.org/boards/${info.id}/images/top-with-background.png`

const {zipPath, folder, width, height} = require('../zip-info.json')

const zipUrl = `https://kitspace.org/${folder}/${zipPath}`

const Page = createClass({
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
            <BoardShowcase zipUrl={zipUrl} folder={folder}>
              <FadeImage src="images/top.svg" />
              <FadeImage src="images/bottom.svg" />
            </BoardShowcase>
            <BoardExtrasMenu
              hasInteractiveBom={info.has_interactive_bom}
              zipUrl={zipUrl}
            />
            {/ozel\/diy_particle_detector/i.test(info.id) && (
              <semantic.Button
                style={{width: '100%', marginTop: 20}}
                size="huge"
                basic
                color="blue"
                as="a"
                href="https://shop.kitspace.org/buy/electron-detector/"
              >
                {/electron-detector/i.test(info.id)
                  ? 'Order a Ready-to-Build Kit'
                  : 'Order a Ready-to-Build Kit of the Electron Detector Variant'}
                <span
                  style={{
                    width: '100%',
                    display: 'flex',
                    justifyContent: 'center',
                    marginTop: 10,
                    marginBottom: 10
                  }}
                >
                  <semantic.Image src="/images/electron_thumbnail.jpeg" />
                </span>
              </semantic.Button>
            )}
            <OrderPcbs />
            <BuyParts lines={info.bom.lines} parts={info.bom.parts} />
            <div className="readme-container">
              <Readme />
            </div>
          </div>
        </div>
      </div>
    )
  }
})

module.exports = Page
