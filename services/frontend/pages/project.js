import React from 'react'
import Gitlab from 'kitspace-gitlab-client'

export default class extends React.Component {
  static async getInitialProps({req, query: {namespace, projectname}}) {
    const cookie = req ? req.headers.cookie : null
    const gitlab = new Gitlab(
      process.env.KITSPACE_DOMAIN + ':' + process.env.KITSPACE_PORT + '/!gitlab',
      null,
      cookie,
    )
    const path = namespace + '/' + projectname
    const [project, files, user] = await Promise.all([
      gitlab.getProject(path),
      gitlab.getProjectFiles(path),
      gitlab.getCurrentUser(),
    ])
    return {project, files, user}
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
