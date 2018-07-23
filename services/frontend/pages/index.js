import Link from 'next/link'
import React from 'react'
import Gitlab from 'kitspace-gitlab-client'

const gitlab = new Gitlab(
  process.env.KITSPACE_DOMAIN + ':' + process.env.KITSPACE_PORT + '/!gitlab',
)

export default class Index extends React.Component {
  static async getInitialProps() {
    const [projects, user] = await Promise.all([
      gitlab.getProjects(),
      gitlab.getCurrentUser(),
    ])
    return {projects, user}
  }
  render() {
    return this.props.projects.map(project => {
      return (
        <li>
          <Link href={`/project/${project.path_with_namespace}`}>
            {project.path_with_namespace}
          </Link>
        </li>
      )
    })
  }
}
