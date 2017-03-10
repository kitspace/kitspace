const Redux     = require('redux')
const React     = require('react')
const {h}       = require('react-hyperscript-helpers')
const path      = require('path')
const immutable = require('immutable')

const TitleBar = require('../title_bar')


const Login = React.createClass({
  getInitialState() {
    return {}
  },
  render() {
    return (
      <div className='Login'>
        <TitleBar submissionButton={true} >
          <div className='titleText'>
            {'Login'}
          </div>
        </TitleBar>
      </div>
    )
  }
})

module.exports = Login
