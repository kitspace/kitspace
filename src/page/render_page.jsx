const React    = require('react')
const ReactDOM = require('react-dom')
const Page     = require('./page')

const info = require('../info.json')

ReactDOM.render(
  <Page info={info}/>,
  document.getElementById('content')
)
