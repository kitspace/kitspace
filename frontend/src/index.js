const React = require('react')
const ReactDOM = require('react-dom')
const Gitlab = require('kitspace-gitlab-client')
const gitlab = new Gitlab('http://localhost:8080/gitlab')
const superagent = require('superagent')
const {Helmet} = require('react-helmet')
const {BrowserRouter, Route, Switch, Redirect} = require('react-router-dom')

class Index extends React.Component {
  constructor() {
    super()
    this.state = {projects: [], user: null}
  }
  componentDidMount() {
    gitlab.getProjects().then(projects => {
      this.setState({projects})
    })
    superagent
      .get('http://localhost:8080/gitlab/api/v4/user')
      .set('Accept', 'application/json')
      .withCredentials()
      .then(r => this.setState({user: r.body}))
      .catch(e => this.setState({user: 'not signed in'}))
  }
  render() {
    return (
      <div>
        <pre>{JSON.stringify(this.state.user, null, 2)}</pre>
      </div>
    )
  }
}

class Login extends React.Component {
  constructor() {
    super()
    this.state = {token: null}
  }
  componentDidMount() {
    superagent.get('http://localhost:8080/gitlab/users/sign_in').then(r => {
      const doc = (new DOMParser).parseFromString(r.text, 'text/html')
      const input = doc.querySelector('input[name=authenticity_token]')
      if (input) {
        this.setState({token: input.value})
      }
    })
  }
  render() {
    return (
      <div>
        <pre>{JSON.stringify(this.state, null, 2)}</pre>
      </div>
    )
  }
}

class App extends React.Component {
  render() {
    return (
      <div>
        <BrowserRouter>
          <Switch>
            <Route exact path="/" component={Index} />
            <Route exact path="/login" component={Login} />
            <Redirect to="/" />
          </Switch>
        </BrowserRouter>
      </div>
    )
  }
}

function trace(x) {
  console.log(x)
  return x
}

const element = document.getElementById('app')
ReactDOM.render(<App />, element)
