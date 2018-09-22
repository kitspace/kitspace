import './settings.scss'
import React from 'react'
import superagent from 'superagent'
import * as semantic from 'semantic-ui-react'
import Head from 'next/head'

import Gitlab from '@kitspace/gitlab-client'
import TitleBar from '../../components/TitleBar'
import ChangeProfile from './ChangeProfile'
import ChangePassword from './ChangePassword'
import {checkGravatar} from './util'

export default class Settings extends React.Component {
  static omitTitleBar = true
  state = {
    emailMessage: '',
    user: null,
    authenticity_token: '',
  }

  getUser = () => {
    return superagent
      .get('/!gitlab/api/v4/user')
      .set('Accept', 'application/json')
      .then(r => {
        const newUser = r.body
        const notGravatar = checkGravatar(newUser.avatar_url)
        //force a re-render of the avatar
        if (notGravatar) {
          newUser.avatar_url += '?' + Math.random()
        }
        this.setState({user: newUser})
      })
  }

  getForm = () => {
    return superagent
      .get('/!gitlab/profile')
      .withCredentials()
      .then(r => {
        const doc = new DOMParser().parseFromString(r.text, 'text/html')
        function copy(selector) {
          document.querySelector(selector).value = doc.querySelector(selector).value
        }
        copy('input[name="user[email]"]')
        copy('input[name="user[name]"]')
        const authenticity_token = doc.querySelector(
          'input[name=authenticity_token]',
        ).value
        const emailMessage = doc.querySelector('input[name="user[email]"]')
          .nextElementSibling
        const email = (emailMessage.querySelector('strong') || {}).innerHTML
        this.setState({confirmationEmail: email, authenticity_token})
      })
      .catch(e => console.error(e))
  }

  componentDidMount() {
    this.getForm()
  }

  render() {
    const user = this.state.user || this.props.user
    return (
      <>
        <Head>
          <title>Settings - Kitspace</title>
        </Head>
        <TitleBar user={user} />
        <div className="Settings">
          <semantic.Container>
            <semantic.Grid>
              <semantic.Grid.Column mobile={14} tablet={10} computer={8}>
                <ChangeProfile
                  authenticity_token={this.state.authenticity_token}
                  getUser={this.getUser}
                  getForm={this.getForm}
                  confirmationEmail={this.state.confirmationEmail}
                  profileMessage={this.state.profileMessage}
                  user={user}
                />
                <ChangePassword
                  passwordMessage={this.state.passwordMessage}
                  authenticity_token={this.state.authenticity_token}
                />
              </semantic.Grid.Column>
            </semantic.Grid>
          </semantic.Container>
        </div>
      </>
    )
  }
}

