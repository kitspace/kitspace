const React = require('react')
const semantic = require('semantic-ui-react')

class OptIn extends React.Component {
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
