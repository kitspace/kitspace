'use strict'
const React = require('react')

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
  render: function() {
    var frontBoardClass = 'frontBoard boardDiagram '
    var backBoardClass = 'backBoard boardDiagram '
    if (this.state.viewFrontBoard) {
      frontBoardClass += ' selectedBoard'
    } else {
      backBoardClass += ' selectedBoard'
    }
    const children = this.props.children || [<div />, <div />]
    return (
      <div className="boardShowcaseContainer">
        <div className="toggleBoardView responsiveTabs">
          <button
            disabled={this.state.viewFrontBoard}
            className="circuitToggleBtn circuitFrontBtn"
            onClick={this.frontBoardView}
          >
            Front
          </button>
          <button
            disabled={!this.state.viewFrontBoard}
            className="circuitToggleBtn circuitBackBtn"
            onClick={this.backBoardView}
          >
            Back
          </button>
        </div>
        <div className="boardShowcase">
          <div className="boardContainer">
            <div className={frontBoardClass}>{children[0]}</div>
            <div className="circuitBorderContainer">
              <div className="circuitBorder" />
            </div>
            <div className={backBoardClass}>{children[1]}</div>
          </div>
        </div>
      </div>
    )
  }
})

module.exports = BoardShowcase
