const React         = require('react')
const DocumentTitle = require('react-document-title')
const superagent    = require('superagent')

const BOM           = require('./bom')
const BoardShowcase = require('./board_showcase')
const StoreButtons  = require('./buy_parts')
const Gerbers       = require('./gerbers')
const InfoBar       = require('./info_bar')

const TitleBar      = require('../title_bar')
const FadeImage     = require('../fade_image')
const Readme        = require('../readme')


const Page = React.createClass({
  getInitialState() {
    return {
      user: null,
    }
  },
  componentDidMount() {
    superagent.get('/accounts/api/v4/user')
      .set('Accept', 'application/json')
      .withCredentials()
      .then(r => this.setState({user: r.body}))
      .catch(e => this.setState({user: 'not signed in'}))
    //set the state to loading if it hasn't gotten the user info after a second
    setTimeout(() => {
      if (this.state.user == null) {
        this.setState({user: 'loading'})
      }
    }, 1000)
  },
  render() {
    const info         = this.props.info
    const titleText    = info.id.split('/').slice(2).join(' / ')
    const subtitleText = info.id.split('/').slice(0,2).join(' / ')
    return (
      <DocumentTitle title={`${titleText} - kitnic.it`}>
        <div className='page'>
          <TitleBar user={this.state.user} submissionButton={true}>
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
            <BOM parts={info.bom.parts} tsv={info.bom.tsv} />
          </div>
        </div>
      </DocumentTitle>
    )
  },
})

module.exports = Page
