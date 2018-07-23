import React from 'react'
import Gitlab from 'kitspace-gitlab-client'

const gitlab = new Gitlab(
  process.env.KITSPACE_DOMAIN + ':' + process.env.KITSPACE_PORT + '/!gitlab',
)

export default class extends React.Component {
  static async getInitialProps({query: {namespace, projectname}}) {
    const path = namespace + '/' + projectname
    const [project, files] = await Promise.all([
      gitlab.getProject(path),
      gitlab.getProjectFiles(path),
    ])
    return {project, files}
  }

  render() {
    return (
      <>
        <pre>{JSON.stringify(this.props.files, null, 2)}</pre>
        <pre>{JSON.stringify(this.props.project, null, 2)}</pre>
      </>
    )
  }
}
