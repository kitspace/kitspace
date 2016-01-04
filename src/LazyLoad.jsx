var React = require('react');
var events = require('add-event-listener');
var isVisible = require('./isVisible');

var LazyLoad = React.createClass({
  displayName: 'LazyLoad',
  propTypes: {
    distance: React.PropTypes.number,
    children: React.PropTypes.element.isRequired
  },

  getDefaultProps: function() {
    return {
      distance: 100
    };
  },

  getInitialState: function() {
    return {
      visible: false
    };
  },
  componentDidMount: function() {
    this._checkViewport();
    events.addEventListener(window, 'scroll', this._checkViewport);
    events.addEventListener(window, 'resize', this._checkViewport);
  },

  componentWillUnmount: function() {
    events.removeEventListener(window, 'scroll', this._checkViewport);
    events.removeEventListener(window, 'resize', this._checkViewport);
  },

  _checkViewport: function() {
    if (!this.state.visible) {
      if (!this.isMounted()) {
        return;
      }
      var el = this.getDOMNode();
      if ( this.state.visible ) {
        return;
      }
      this.setState({
        visible: isVisible(el, this.props.distance)
      });
    }
  },

  render: function() {
    // when not visible, return our placeholder
    if (!this.state.visible) {
      return (<div></div>);
    }
    // otherwise return the children
    return this.props.children;
  }
});

module.exports = LazyLoad;
