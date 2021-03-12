const React = require('react')
const createClass = require('create-react-class')
const semantic = require('semantic-ui-react')

const mediaQueries = require('../media_queries')
const {zipPath, folder, width, height, layers} = require('../zip-info.json')

const zipUrl = `https://kitspace.org/${folder}/${zipPath}`
const aislerUrl = `https://aisler.net/p/new?url=${zipUrl}&ref=kitspace`
const pcbwayUrl = `https://www.pcbway.com/QuickOrderOnline.aspx?fileurl=${zipUrl}&from=kitspace`
const oshparkUrl = `https://oshpark.com/import?url=${zipUrl}`
const pcbShopperUrl = `https://pcbshopper.com/?Width=${width}&Height=${height}&Units=mm&Layers=${layers}&Quantity=1&GetPrices`
const jlcpcbUrl = `https://cart.jlcpcb.com/quote?fileurl=${zipUrl}&from=kitspace`

let OrderPcbs = createClass({
  render() {
    return (
      <div className="PcbMenu">
        <div className="PcbMenu__group PcbMenu__download">
          <a href={zipPath} className="PcbMenu__link">
            <semantic.Icon name="download" />
            Download Gerbers
          </a>
        </div>

        <div
          className="PcbMenu__group"
          style={{flexGrow: 1, justifyContent: 'space-around'}}
        >
          <div className="PcbMenu__sub-title">
            <h4>Order PCBs:</h4>
          </div>

          <div className="PcbMenu__links-container">
            <a
              rel="nofollow"
              href={aislerUrl}
              className="PcbMenu__link"
              target="_blank"
              onClick={e => {
                e.preventDefault()
                window.plausible != null &&
                  window.plausible('Quote PCB', {
                    props: {vendor: 'Aisler', project: this.props.project}
                  })
                window.open(aislerUrl, '_blank')
              }}
            >
              <img src="/images/aisler.png" />
              <semantic.Flag name="de" />
            </a>

            <a
              rel="nofollow"
              href={pcbwayUrl}
              className="PcbMenu__link"
              target="_blank"
              onClick={e => {
                e.preventDefault()
                window.plausible != null &&
                  window.plausible('Quote PCB', {
                    props: {vendor: 'PCBWay', project: this.props.project}
                  })
                window.open(pcbwayUrl, '_blank')
              }}
            >
              <img src="/images/pcbway.png" />
              <semantic.Flag name="cn" />
            </a>

            <a
              rel="nofollow"
              href={jlcpcbUrl}
              className="PcbMenu__link"
              target="_blank"
              onClick={e => {
                e.preventDefault()
                window.plausible != null &&
                  window.plausible('Quote PCB', {
                    props: {vendor: 'JLCPCB', project: this.props.project}
                  })
                window.open(jlcpcbUrl, '_blank')
              }}
            >
              <img src="/images/jlcpcb.png" />
              <semantic.Flag name="cn" />
            </a>

            <a
              rel="nofollow"
              href={oshparkUrl}
              className="PcbMenu__link"
              target="_blank"
              onClick={e => {
                e.preventDefault()
                window.plausible != null &&
                  window.plausible('Quote PCB', {
                    props: {vendor: 'OSHPark', project: this.props.project}
                  })
                window.open(oshparkUrl, '_blank')
              }}
            >
              <img src="/images/oshpark.png" />
              <semantic.Flag name="us" />
            </a>
          </div>
        </div>

        <div className="PcbMenu__group PcbMenu__compare">
          <div className="PcbMenu__sub-title">
            <h4>Compare PCB Prices:</h4>
          </div>
          <div className="PcbMenu__links-container">
            <a
              rel="nofollow"
              href={pcbShopperUrl}
              className="PcbMenu__link"
              onClick={e => {
                e.preventDefault()
                window.plausible != null &&
                  window.plausible('Quote PCB', {
                    props: {vendor: 'PCB Shopper', project: this.props.project}
                  })
                window.open(pcbShopperUrl, '_blank')
              }}
            >
              >
              <img src="/images/pcbshopper.png" />
            </a>
          </div>
        </div>
      </div>
    )
  }
})

module.exports = OrderPcbs
