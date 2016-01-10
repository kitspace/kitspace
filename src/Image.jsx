var React = require('react');
var ReactDOM = require('react-dom');

function isServer() {
   return ! (typeof window != 'undefined' && window.document);
}

var Image = React.createClass({
  getInitialState: function() {
    if (isServer()) {
      return {opacity: 1};
    } else {
      return {opacity: 0};
    }
  },

  fadeIn: function() {
    this.setState({opacity: 1});
  },

  render: function (){
    //this vs including an Object.assign polyfill
    var style = this.props.style || {};
    style.transition = 'opacity ' + (this.props.speed || 1) + 's';
    style.opacity = this.state.opacity;

    return (
      <img
        {...this.props}
        style={style}
        src={this.props.src}
        onLoad={this.fadeIn}
      />
    )
  }
});

module.exports = Image;
