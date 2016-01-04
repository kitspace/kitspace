var React = require('react');
var ReactDOM = require('react-dom');

function getViewportWidth() {
        if (typeof window !== 'undefined') {
            return window.innerWidth || document.documentElement.clientWidth;
        } else {
            return 0;
        }
}

function getViewportHeight() {
        if (typeof window !== 'undefined') {
            return window.innerHeight || document.documentElement.clientHeight;
        } else {
            return 0;
        }
}
// document.body.scrollTop was working in Chrome but didn't work on Firefox, so had to resort to window.pageYOffset
// but can't fallback to document.body.scrollTop as that doesn't work in IE with a doctype (?) so have to use document.documentElement.scrollTop
function getPageOffset(){
    return window.pageYOffset || document.documentElement.scrollTop;
}

function checkElementInViewport(element, lazyOffset){
  var elementOffsetTop = 0;
  var offset = getPageOffset() + lazyOffset;
  var viewportHeight = getViewportHeight();

  if (element.offsetParent) {
    do {
      elementOffsetTop += element.offsetTop;
    }
    while (element = element.offsetParent);
  }

  return elementOffsetTop < (viewportHeight + offset);
}

var Image = React.createClass({
  getInitialState: function() {
    return {opacity: 0};
  },

  fadeIn: function() {
    this.setState({opacity: 1});
  },

  render: function (){
    //this vs including an Object.assign polyfill
    var style = this.props.style || {};
    style.transition = `opacity ${this.props.speed || 1}s`;
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
