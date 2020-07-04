const React = require('react')
const createClass = require('create-react-class')
const semantic = require('semantic-ui-react')
const TitleBar = require('../title_bar')
const IBOM = require('./IBOM')

const InteractiveBOM = createClass({
  render() {
    return (
      <div className="ibom_wrapper">
        <TitleBar route="/interactive_bom" />
        {this.state.loading ?
         <semantic.Container style={{marginTop: 50}}>
           <semantic.Loader size='big' active>
             Loading PCB data...
           </semantic.Loader>
         </semantic.Container>
        :
         <IBOM pcbdata={this.state.pcbdata} />}
      </div>
    )
  },
  getInitialState() {
    return { loading: true, pcbdata: null }
  },
  componentDidMount() {
    const dataUrl = window.location.search.substring(1) + '/interactive_bom.json'
    fetch(dataUrl)
      .then((res) => res.json())
      .then((res) => {
        this.setState({ loading: false, pcbdata: res })
    })
  }
})

module.exports = InteractiveBOM
