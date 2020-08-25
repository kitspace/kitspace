'use strict'
const React = require('react')
const createClass = require('create-react-class')
const LazyLoad = require('../lazy_load')
const IBomIcon = require('./ibom_icon')
const TracespaceIcon = require('./tracespace_icon')
const {Icon, Segment, Button, Header} = require('semantic-ui-react')

var BoardShowcase = createClass({
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
      <div className="boardshowcase-with-menu">
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
          </div>
        </div>
        <div className="boardshowcase-menu">
          <Button
            basic
            as="a"
            href={`https://tracespace.io/view/?boardUrl=${this.props.zipUrl}`}
          >
            <div style={{display: 'flex', flexDirection: 'column'}}>
              <Header as="h4">
                <TracespaceIcon />
                Inspect Gerbers
              </Header>
              <div>Tracespace View</div>
            </div>
          </Button>
          {this.props.hasInteractiveBom && (
            <Button
              basic
              as="a"
              href={`/interactive_bom?${this.props.folder}`}
            >
              <div style={{display: 'flex', flexDirection: 'column'}}>
                <Header as="h4">
                  <IBomIcon />
                  Assembly Guide
                </Header>
                <div>Interactive HTML BOM</div>
              </div>
            </Button>
          )}
        </div>
      </div>
    )
  }
})

module.exports = BoardShowcase
