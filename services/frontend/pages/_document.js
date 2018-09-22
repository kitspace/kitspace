import Document, {Head, Main, NextScript} from 'next/document'

export default class MyDocument extends Document {
  render() {
    return (
      <html>
        <Head>
          <link rel="stylesheet" href="/static/semantic.min.css" />
          <link rel="stylesheet" href="/_next/static/style.css" />
          <link
            rel="stylesheet"
            href="https://cdnjs.cloudflare.com/ajax/libs/octicons/3.3.0/octicons.min.css"
          />
          <link rel="icon" type="image/png" href="/static/favicon.png" />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </html>
    )
  }
}
