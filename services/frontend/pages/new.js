import Link from 'next/link'
import Head from 'next/head'
import React from 'react'
import * as semantic from 'semantic-ui-react'
import Gitlab from 'kitspace-gitlab-client'

import './new.scss'

export default class New extends React.Component {
  static async getInitialProps({req, gitlab}) {
    return {}
  }
  render() {
    return (
      <>
        <Head>
          <title>New Project - Kitspace</title>
        </Head>
        <semantic.Segment className="New">
          <div className="ui two column stackable center aligned grid">
            <semantic.Grid.Row verticalAlign='middle'>
              <semantic.Grid.Column>
                <p>Upload Gerbers, CAD files, BOM (csv, xlsx, ods)</p>
                <semantic.Button color='green'>Upload Files</semantic.Button>
              </semantic.Grid.Column>
              <div className="dividerContainer">
                <semantic.Divider vertical>Or</semantic.Divider>
              </div>
              <semantic.Grid.Column>
                <p>Import and link an existing Git repository</p>
                <semantic.Input
                  action={{content: 'Import', color: 'green'}}
                  value="https://"
                />
              </semantic.Grid.Column>
            </semantic.Grid.Row>
          </div>
        </semantic.Segment>
      </>
    )
  }
}
