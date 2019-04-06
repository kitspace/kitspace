const React = require('react')
const semantic = require('semantic-ui-react')
const superagent = require('superagent')

class OptIn extends React.Component {
  constructor(...args) {
    super(...args)
    this.state = {optOut: null}
  }
  componentDidMount() {
    const promise = superagent.get(
      'https://matomo.kitspace.org/index.php?module=API&method=AjaxOptOut.isTracked'
    )
    promise.then(r => console.log(r))
  }
  render() {
    return (
      <semantic.Segment compact className="OptIn">
        <div>
          We collect statistics about visitors to this site. This data helps us
          to justify our work and improve Kitspace. See our{' '}
          <a href="/privacy">privacy policy</a> for details.
        </div>
        <div style={{minWidth: 130}}>
          <semantic.Button size="mini">Opt Out</semantic.Button>
          <semantic.Button size="mini" primary>
            OK
          </semantic.Button>
        </div>
      </semantic.Segment>
    )
  }
}

module.exports = OptIn
