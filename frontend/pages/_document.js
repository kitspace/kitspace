import Document, {Head, Main, NextScript} from 'next/document';
import flush from 'styled-jsx/server';

export default class MyDocument extends Document {
  static getInitialProps({renderPage}) {
    const {html, head, errorHtml, chunks} = renderPage();
    const styles = flush();
    return {html, head, errorHtml, chunks, styles};
  }

  render() {
    return (
      <html>
        <Head>
          <link
            href="/static/semantic-ui-css/semantic.min.css"
            rel="stylesheet"
          />
          <link rel="icon" type="image/png" href="/static/favicon.png" />
        </Head>
        <body className="custom_class">
          {this.props.customValue}
          <Main />
          <NextScript />
        </body>
      </html>
    );
  }
}
