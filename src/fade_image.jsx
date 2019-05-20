var React = require('react')

var FadeImage = React.createClass({
  propTypes: {
    style: React.PropTypes.any,
    speed: React.PropTypes.any,
    src: React.PropTypes.string.isRequired
  },
  getInitialState: function() {
    return {opacity: 0}
  },

  fadeIn: function() {
    this.setState({opacity: 1})
  },

  render: function() {
    //this vs including an Object.assign polyfill
    var style = this.props.style || {}
    style.transition = 'opacity ' + (this.props.speed || 1) + 's'
    style.opacity = this.state.opacity

    return (
      <img
        {...this.props}
        style={style}
        src={this.props.src}
        onLoad={this.fadeIn}
      />
    )
  }
})

module.exports = FadeImage
