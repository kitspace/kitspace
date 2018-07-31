import App, {Container} from 'next/app'
import React from 'react'
import Gitlab from 'kitspace-gitlab-client'
import TitleBar from '../components/TitleBar'

export default class KitspaceApp extends App {
  static async getInitialProps({Component, router, ctx}) {
    const cookie = ctx.req ? ctx.req.headers.cookie : null
    const gitlab = new Gitlab(
      process.env.KITSPACE_DOMAIN + ':' + process.env.KITSPACE_PORT + '/!gitlab',
      null,
      cookie,
    )

    function getInitialProps() {
      return Component.getInitialProps
        ? Component.getInitialProps(Object.assign(ctx, {gitlab}))
        : Promise.resolve({})
    }

    const [user, pageProps] = await Promise.all([
      gitlab.getCurrentUser(),
      getInitialProps(),
    ])

    return {user, pageProps, route: router.route}
  }

  render() {
    const {Component, user, pageProps, route} = this.props
    return (
      <Container>
        {Component.name === 'Settings' ? null : <TitleBar user={user} active={route}/>}
        <Component user={user} {...pageProps} />
      </Container>
    )
  }
}
