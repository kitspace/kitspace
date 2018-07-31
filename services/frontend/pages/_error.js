import React from 'react'
import PropTypes from 'prop-types'
import HTTPStatus from 'http-status'
import Head from 'next/head'
import Link from 'next/link'

export default class Error extends React.Component {
  static getInitialProps({res, err}) {
    const statusCode = res ? res.statusCode : err ? err.statusCode : null
    return {statusCode}
  }

  static propTypes = {
    statusCode: PropTypes.number,
  }

  render() {
    const {statusCode} = this.props
    const title =
      statusCode === 404
        ? 'Sorry, this page could not be found'
        : HTTPStatus[statusCode] || 'Sorry, an unexpected error occurred'

    return (
      <div style={styles.error}>
        <Head>
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          <title>
            {statusCode}: {title}
          </title>
        </Head>
        <div>
          <style dangerouslySetInnerHTML={{__html: 'body { margin: 0 }'}} />
          {statusCode ? <h1 style={styles.h1}>{statusCode}</h1> : null}
          <div style={styles.desc}>
            <h2 style={styles.h2}>{title}.</h2>
          </div>
          <div style={styles.link}>
            <Link href="/">
              <a>View all projects</a>
            </Link>
          </div>
        </div>
      </div>
    )
  }
}

const styles = {
  error: {
    color: '#000',
    background: '#fff',
    fontFamily: 'Noto Sans',
    height: '70vh',
    textAlign: 'center',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },

  desc: {
    display: 'inline-block',
    textAlign: 'left',
    lineHeight: '49px',
    height: '49px',
    verticalAlign: 'middle',
  },

  h1: {
    display: 'inline-block',
    borderRight: '1px solid rgba(0, 0, 0,.3)',
    margin: 0,
    marginRight: '20px',
    padding: '10px 23px 10px 0',
    fontSize: '24px',
    fontWeight: 500,
    verticalAlign: 'top',
  },

  h2: {
    fontSize: '16px',
    fontWeight: 'normal',
    lineHeight: 'inherit',
    margin: 0,
    padding: 0,
  },

  link: {
    marginTop: 50,
  },
}
