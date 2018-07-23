import Link from 'next/link'
import React from 'react'
import Gitlab from 'kitspace-gitlab-client'

export default class Index extends React.Component {
  static async getInitialProps({req}) {
    const cookie = req ? req.headers.cookie : null
    const gitlab = new Gitlab(
      process.env.KITSPACE_DOMAIN + ':' + process.env.KITSPACE_PORT + '/!gitlab',
      null,
      cookie,
    )
    const [projects, user] = await Promise.all([
      gitlab.getProjects(),
      gitlab.getCurrentUser(),
    ])
    return {projects, user}
  }
  render() {
    return [<pre>{(this.props.user || {}).username}</pre>].concat(
      this.props.projects.map(project => {
        return (
          <li>
            <Link href={`/${project.path_with_namespace}`}>
              <a>{project.path_with_namespace}</a>
            </Link>
          </li>
        )
      }),
    )
  }
}
