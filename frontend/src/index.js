const React = require('react')
const ReactDOM = require('react-dom')
const Gitlab = require('kitspace-gitlab-client')
const gitlab = new Gitlab('http://localhost:8079')

class Index extends React.Component {
  constructor() {
    super()
    this.state = {projects: []}
  }
  componentDidMount() {
    gitlab.getProjects().then(projects => {
      console.log(projects)
      this.setState({projects})
    })
  }
  render() {
    return (
      <div>
        <pre>{JSON.stringify(this.state.projects, null, 2)}</pre>
      </div>
    )
  }
}

const element = document.getElementById('app')
ReactDOM.render(<Index />, element)
