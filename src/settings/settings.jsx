const Redux     = require('redux')
const React     = require('react')
const {h}       = require('react-hyperscript-helpers')
const path      = require('path')
const immutable = require('immutable')
const {Router, Route, Link, hashHistory} = require('react-router')

const TitleBar = require('../title_bar')

const Settings = React.createClass({
  render() {
    return (
      <div>
        <TitleBar>
          <div className='titleText'>
            {'Settings'}
          </div>
        </TitleBar>
        settings
      </div>
    )
  }
})

module.exports = Settings
