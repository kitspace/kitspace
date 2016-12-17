'use strict'
const React     = require('react')
const Gerbers   = require('./gerbers')
const LazyLoad  = require('./lazy_load')
const FadeImage = require('./fade_image')

var BoardShowcase = React.createClass({
  getInitialState: function() {
    return {
      viewFrontBoard: true
    }
  },
  frontBoardView: function(e) {
    e.preventDefault()
    this.setState({
      viewFrontBoard: true
    })
  },
  backBoardView: function(e) {
    e.preventDefault()
    this.setState({
      viewFrontBoard: false
    })
  },
  render: function () {
    var frontBoardClass = 'frontBoard boardDiagram '
    var backBoardClass = 'backBoard boardDiagram '
    if (this.state.viewFrontBoard) {
      frontBoardClass += ' selectedBoard'
    } else {
      backBoardClass += ' selectedBoard'
    }
    return (
      <div className="boardShowcaseContainer">
        <Gerbers />
        <div className="toggleBoardView responsiveTabs">
          <button
          disabled={this.state.viewFrontBoard}
          className="circuitToggleBtn circuitFrontBtn"
          onClick={this.frontBoardView}>
            Front
          </button>
          <button
          disabled={!this.state.viewFrontBoard}
          className="circuitToggleBtn circuitBackBtn"
          onClick={this.backBoardView}>
            Back
          </button>
        </div>
        <div className="boardShowcase">
          <LazyLoad once={true}
            component={React.createElement('div', {className:'img'})}
            distance={300}>
            <div className="boardContainer">
              <FadeImage className={frontBoardClass} src='images/top.svg' />
              <div className="circuitBorderContainer">
                <div className="circuitBorder"></div>
              </div>
              <FadeImage className={backBoardClass} src='images/bottom.svg' />
            </div>
          </LazyLoad>
        </div>
      </div>
    )
  }
})

module.exports = BoardShowcase
