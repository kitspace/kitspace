const React = require('react')
const createClass = require('create-react-class')

const FadeImage = createClass({
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
