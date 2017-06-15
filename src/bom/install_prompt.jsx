const React          = require('react')
const semantic       = require('semantic-ui-react')
const browserVersion = require('browser-version')


const InstallPrompt = React.createClass({
  getInitialState() {
    return {
      compatible: true,
      timed_out: false,
    }
  },
  componentDidMount() {
    setTimeout(() => {
      this.setState({timed_out: true})
    }, 3000)
    this.setState({compatibility: this.getCompatibility()})
  },
  render() {
    return (
      <semantic.Table.Row>
        {(() => {
          if (this.props.extensionPresence === 'present') {
            return
          }
          else if (this.state.timed_out) {
            if (this.state.compatible) {
              return (<PleaseInstall colSpan={this.props.colSpan} />)
            } else {
              return (<NotCompatible colSpan={this.props.colSpan} />)
            }
          }
        })()}
      </semantic.Table.Row>
    )
  },
  getCompatibility() {
    if (typeof navigator == 'undefined')
      return true
    if (/Mobile/i.test(navigator.userAgent))
      return false
    const version = browserVersion()
    return (/Chrome/.test(version) || /Firefox/.test(version))
  },
})

function PleaseInstall(props) {
  return (
    <semantic.Table.Cell warning colSpan={props.colSpan}>
      <semantic.Icon name='attention' />
      Please <a onClick={props.bomInstallLink}>install the 1-click BOM
        extension</a> to make full use of this feature.
    </semantic.Table.Cell>
  )
}

function NotCompatible(props) {
  return (
    <semantic.Table.Cell warning colSpan={props.colSpan} >
      <semantic.Icon name='attention' />
      Sorry, the <a className='bomPromptLink'
        href='https://1clickbom.com/'>1-click BOM extension</a> is not yet
      available for your browser. Only the Digikey add-to-cart links work
      fully, Farnell and Newark should work but the references will not be
      added as line-notes.
    </semantic.Table.Cell>
  )
}

module.exports = InstallPrompt
