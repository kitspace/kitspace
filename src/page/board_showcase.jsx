'use strict'
const React = require('react')
const LazyLoad = require('../lazy_load')
const {Icon} = require('semantic-ui-react')

var BoardShowcase = React.createClass({
  getInitialState: function() {
    return {
      viewFrontBoard: true
    }
  },
  frontBoardView: function(e) {
    e.preventDefault()
    console.log('here')
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
    const zipUrl = this.props.zipUrl
    if (this.state.viewFrontBoard) {
      frontBoardClass += ' selectedBoard'
    } else {
      backBoardClass += ' selectedBoard'
    }
    const children = this.props.children || [<div />, <div />]
    const TraceSpaceLink = props =>
      zipUrl ? (
        <a
          href={`https://tracespace.io/view/?boardUrl=${zipUrl}`}
          target="_blank"
          title="Open in Tracespace"
        >
          {props.children}
        </a>
      ) : (
        <div>{props.children}</div>
      )
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
        <TraceSpaceLink>
          <div className="boardShowcase">
            <LazyLoad
              once={true}
              component={React.createElement('div', {className: 'img'})}
              distance={300}
            >
              <div className="boardContainer">
                <div className={frontBoardClass}>{children[0]}</div>
                <div className="circuitBorderContainer">
                  <div className="circuitBorder" />
                </div>
                <div className={backBoardClass}>{children[1]}</div>
              </div>
            </LazyLoad>
            <Icon id="externalLink" name="external alternate" />
          </div>
        </TraceSpaceLink>
      </div>
    )
  }
})

module.exports = BoardShowcase
