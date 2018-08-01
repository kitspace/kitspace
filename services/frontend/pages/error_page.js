import Error from './_error'

export default class ErrorPage extends React.Component {
  static async getInitialProps({query}) {
    return {statusCode: parseInt(query.statusCode, 10)}
  }
  render() {
    return <Error statusCode={this.props.statusCode} />
  }
}
