var React = require('react');
var events = require('add-event-listener');
var isVisible = require('./isVisible');

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
      distance: 100
      , component: <div></div>
      , once: false
    };
  },

  getInitialState: function() {
    return {
      visible: false
    };
  },
  componentDidMount: function() {
    this._startCallbackViewport();
  },
  componentWillUnmount: function() {
    this._stopCallbackViewport();
  },
  _startCallbackViewport: function () {
    this._checkViewport()
    this._timer = setInterval(this._checkViewport, 1000);
  },
  _stopCallbackViewport: function () {
    clearInterval(this._timer);
  },
  _checkViewport: function() {
    if (this._checkViewportWaiting) {
      return;
    }
    if (!this.isMounted()) {
      return;
    }
    if (this.props.once && this.state.visible) {
      return;
    }
    this._checkViewportWaiting = true;
    var el = this.getDOMNode();
    this.setState({
      visible: isVisible(el, this.props.distance)
    });
    setTimeout(function () {
      this._checkViewportWaiting = false;
    }.bind(this), 100);
  },

  render: function() {
    // when not visible, return our placeholder
    if (!this.state.visible) {
      return this.props.component;
    }
    // otherwise return the children
    return this.props.children;
  }
});

module.exports = LazyLoad;
