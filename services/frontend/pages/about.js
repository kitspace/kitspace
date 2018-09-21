import * as semantic from 'semantic-ui-react'
import Link from 'next/link'
import Head from 'next/head'
import React from 'react'
import Gitlab from 'kitspace-gitlab-client'
import TitleBar from '../components/TitleBar'

import './about.scss'

export default class About extends React.Component {
  render() {
    return (
      <>
        <Head>
          <title>About - Kitspace</title>
        </Head>
        <semantic.Container
          text
          className="About"
          textAlign="justified"
          style={{marginTop: 100}}
        >
          <p>
            Kit Space (formerly called Kitnic) is a registry of open hardware
            electronics projects that are ready for you to order and build. It could
            be described as a "Thingiverse for electronics". Click on any project to
            get further info, download the Gerbers and see the bill of materials.
          </p>
          <p>
            To quickly purchase the parts from various retailers you should{' '}
            <a>install</a> the 1-click BOM extension. It's pretty useful on its own
            too and can be used on other sites. Read more about it{' '}
            <a className="clickableLink" href="http://1clickBOM.com">
              here
            </a>
            .
          </p>
          <p>
            Help make an open hardware repository of useful electronics projects!{' '}
            <a href="/submit">Submit</a> your own project to have it listed here.
            Follow Kit Space on{' '}
            <a href="https://twitter.com/kitspaceorg">Twitter</a>,{' '}
            <a href="https://www.facebook.com/kitspaceorg">Facebook</a>,{' '}
            <a href="https://reddit.com/r/kitspace">Reddit</a>,{' '}
            <a href="https://hackaday.io/project/11871-kitspace">Hackaday.io</a> or{' '}
            <a href="https://github.com/monostable/kitspace">GitHub</a> to get
            updates as we progress and add content.
          </p>
        </semantic.Container>
      </>
    )
  }
}
