import App, {Container} from 'next/app'
import React from 'react'
import Gitlab from '@kitspace/gitlab-client'
import TitleBar from '../components/TitleBar'
import {Router} from '../routes'

export default class KitspaceApp extends App {
  setMessage = message => {
    this.setState({message})
    setTimeout(() => this.setState({message: null}), 30000)
  }
  constructor(props) {
    super(props)
    this.state = {user: props.user, message: null}
  }
  static async getInitialProps({Component, router, ctx}) {
    const cookie = ctx.req ? ctx.req.headers.cookie : null
    const gitlab = new Gitlab(
      process.env.KITSPACE_DOMAIN + ':' + process.env.KITSPACE_PORT + '/!gitlab',
      null,
      cookie,
    )

    function getPageProps() {
      return Component.getInitialProps
        ? Component.getInitialProps(Object.assign(ctx, {gitlab})).catch(e => {
            console.error(e)
            return {}
          })
        : Promise.resolve({})
    }

    const [user, pageProps] = await Promise.all([
      gitlab.getCurrentUser().catch(e => {
        console.error(e)
        return null
      }),
      getPageProps(),
    ])

    return {user, pageProps, route: ctx.asPath}
  }

  setUser = user => {
    this.setState({user})
  }

  render() {
    const {Component, pageProps, route} = this.props
    const user = this.state.user || this.props.user
    return (
      <Container>
        {Component.omitTitleBar ? null : (
          <TitleBar setUser={this.setUser} user={user} route={route} />
        )}
        <Component
          message={this.state.message}
          setMessage={this.setMessage}
          setUser={this.setUser}
          user={user}
          {...pageProps}
        />
      </Container>
    )
  }
}
