import {Link} from '../routes'
import Head from 'next/head'
import React from 'react'

export default class Index extends React.Component {
  static async getInitialProps({req, gitlab}) {
    const projects = await gitlab.getProjects()
    return {projects}
  }
  render() {
    const projects = this.props.projects.map(project => {
      return (
        <li key={project.path_with_namespace}>
          <Link prefetch href={'/' + project.path_with_namespace}>
            <a>{project.path_with_namespace}</a>
          </Link>
        </li>
      )
    })
    return (
      <>
        <Head>
          <title>Kitspace</title>
        </Head>
        {projects}
      </>
    )
  }
}
