const React = require('react')
const semantic = require('semantic-ui-react')
const browserVersion = require('browser-version')

const InstallPrompt = React.createClass({
  getInitialState() {
    return {
      compatible: true,
      timed_out: false
    }
  },
  componentDidMount() {
    setTimeout(() => {
      this.setState({
        timed_out: true,
        compatible: this.getCompatibility()
      })
    }, 5000)
  },
  render() {
    if (this.props.extensionPresence === 'present') {
      return <div />
    } else if (this.state.timed_out) {
      if (this.state.compatible) {
        return <PleaseInstall bomInstallLink={this.props.bomInstallLink} />
      } else {
        return <NotCompatible />
      }
    }
    return <div />
  },
  getCompatibility() {
    if (typeof navigator === 'undefined') {
      return true
    }
    if (/Mobile/i.test(navigator.userAgent)) {
      return false
    }
    const version = browserVersion()
    return /Chrome/.test(version) || /Firefox/.test(version)
  }
})

function PleaseInstall(props) {
  return (
    <semantic.Message attached warning>
      <semantic.Icon name="attention" />
      Please{' '}
      <a onClick={props.bomInstallLink}>install the 1-click BOM extension</a> to
      make full use of this feature.
    </semantic.Message>
  )
}

function NotCompatible(props) {
  return (
    <semantic.Message attached warning>
      <semantic.Icon name="attention" />
      Sorry, the{' '}
      <a className="bomPromptLink" href="/1-click-bom">
        1-click BOM extension
      </a>{' '}
      is not yet available for your browser. Only the Digikey add-to-cart links
      work fully, Farnell and Newark should work but the references will not be
      added as line-notes.
    </semantic.Message>
  )
}

module.exports = InstallPrompt
