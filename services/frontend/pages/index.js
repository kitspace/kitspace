import Link from 'next/link'
import React from 'react'
import Gitlab from 'kitspace-gitlab-client'
import TitleBar from '../components/TitleBar'

export default class Index extends React.Component {
  static async getInitialProps({req, gitlab}) {
    const projects = await gitlab.getProjects()
    return {projects}
  }
  render() {
    const projects = this.props.projects.map(project => {
      return (
        <li key={project.path_with_namespace}>
          <Link href={`/${project.path_with_namespace}`}>
            <a>{project.path_with_namespace}</a>
          </Link>
        </li>
      )
    })
    return (
      <>
        {projects}
      </>
    )
  }
}
