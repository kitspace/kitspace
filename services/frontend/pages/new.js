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
          <div className="options">
            <div className="optionContainer">
              <div>
                <semantic.Button size="large" primary>
                  Upload Files
                </semantic.Button>
              </div>
            </div>
            <div style={{minWidth: 100}}>
              <semantic.Divider vertical> or </semantic.Divider>
            </div>
            <div className="optionContainer">
              <div>
                <form className="ui large form">
                  <semantic.Form.Input
                    label="Link a Git repository"
                    value="https://"
                    action={{content: 'Submit'}}
                  />
                </form>
              </div>
            </div>
          </div>
        </semantic.Segment>
      </>
    )
  }
}
