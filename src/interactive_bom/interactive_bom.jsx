const React = require('react')
const ReactDOMServer = require('react-dom/server')
const createClass = require('create-react-class')
const {Helmet} = require('react-helmet')
const semantic = require('semantic-ui-react')
const screenfull = require('screenfull')

const TitleBar = require('../title_bar')
const IBOM = require('./IBOM')

const descriptionFixed =
  ' - Shared on Kitspace - Kitspace is a place to share ready to order electronics designs. You can order the right components for this project with a few clicks.'

  const InteractiveBOM = createClass({
    render() {
      return (
        <div>
          <Helmet>
            <title>{this.state.titleText}</title>
            <meta name="description" content={this.state.summary} />

            <meta itemprop="name" content={this.state.titleText} />
            <meta itemprop="description" content={this.state.description} />
            <meta itemprop="image" content={this.state.metaImage} />

            <meta property="og:type" content="website" />
            <meta property="og:title" content={this.state.titleText} />
            <meta property="og:description" content={this.state.description} />
            <meta property="og:image" content={this.state.metaImage} />
            <meta property="og:image:width" content={1000} />
            <meta property="og:image:height" content={524} />

            <meta name="twitter:card" content="summary_large_image" />
            <meta name="twitter:title" content={this.state.titleText} />
            <meta name="twitter:description" content={this.state.description} />
            <meta name="twitter:image" content={this.state.metaImage} />
          </Helmet>
          <div className="ibom_wrapper">
            <TitleBar route="/interactive_bom" />
            {this.state.loading ?
             <semantic.Container style={{marginTop: 50}}>
               <semantic.Loader size='big' active>
                 Loading PCB data...
               </semantic.Loader>
             </semantic.Container>
            :
             <IBOM pcbdata={this.state.pcbdata} />}
          </div>
        </div>
      )
    },
    getInitialState() {
      return {
        loading: true,
        pcbdata: null,
        project: null,
        summary: 'Loading PCB data...',
        titleText: 'Kitspace Interactive Assembly Guide: loading PCB data...',
        description: 'Kitspace Interactive Assembly Guide: loading PCB data...',
        metaImage: ''
      }
    },
    componentDidMount() {
      const id = window.location.search.substring(1)
      const idText = id.split('/').slice(-1).join(' / ')
      const boardUrl = '/boards/' + id + '/'
      const dataUrl = boardUrl + 'interactive_bom.json'
      fetch(dataUrl)
        .then((res) => res.json())
        .then((res) => {
          const title = id + ' Kitspace Interactive Assembly Guide'
          res.metadata.title = ReactDOMServer.renderToString(
            <a href={boardUrl}>
              {res.metadata.title}
            </a>
          )
          this.setState({
            loading: false,
            pcbdata: res,
            project: id,
            summary: res.summary,
            titleText: title,
            description: title + descriptionFixed,
            metaImage: `https://kitspace.org/${id}/images/top-with-background.png`
          })
        })
    }
})

module.exports = InteractiveBOM
