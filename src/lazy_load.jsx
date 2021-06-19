const React = require('react')
const createClass = require('create-react-class')
const ReactDOM = require('react-dom')
const isVisible = require('./is_visible')

const LazyLoad = createClass({
  displayName: 'LazyLoad',
  getDefaultProps: function() {
    return {
      distance: 100,
      component: <div />,
      once: false
    }
  },

  getInitialState: function() {
    return {
      visible: false
    }
  },

  componentDidMount: function() {
    this._checkViewport()
    this._timer = setInterval(this._checkViewport, 1000)
  },

  componentWillUnmount: function() {
    clearInterval(this._timer)
  },

  _checkViewport: function() {
    if (this.props.once && this.state.visible) {
      return
    }
    const el = ReactDOM.findDOMNode(this)
    this.setState({
      visible: isVisible(el, this.props.distance)
    })
  },

  render: function() {
    // when not visible, return our placeholder
    if (!this.state.visible) {
      return this.props.component
    }
    // otherwise return the children
    return this.props.children
  }
})

module.exports = LazyLoad
