var React = require('react')
var ReactDOM = require('react-dom')
var isVisible = require('./is_visible')

var LazyLoad = React.createClass({
  displayName: 'LazyLoad',
  propTypes: {
    distance: React.PropTypes.number,
    component: React.PropTypes.node.isRequired,
    children: React.PropTypes.node.isRequired,
    once: React.PropTypes.bool
  },

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
    var el = ReactDOM.findDOMNode(this)
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
