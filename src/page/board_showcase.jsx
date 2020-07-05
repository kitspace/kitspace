'use strict'
const React = require('react')
const createClass = require('create-react-class')
const LazyLoad = require('../lazy_load')
const {Icon, Menu, Header} = require('semantic-ui-react')

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
    const zipUrl = this.props.zipUrl
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
          <Menu>
            <Menu.Item
              as="a"
              href={`https://tracespace.io/view/?boardUrl=${zipUrl}`}
            >
              <Header as="h4">
                <svg
                  id="traceSpaceLogo"
                  viewBox="0 0 36 36"
                  height="18"
                  style={{paddingRight: 10}}
                >
                  <path d="M22 14H36V0H16L0 16V36H14V22L22 14Z M36 28C36 32.4183 32.4183 36 28 36C23.5817 36 20 32.4183 20 28C20 23.5817 23.5817 20 28 20C32.4183 20 36 23.5817 36 28Z" />
                </svg>
                Inspect Gerbers
              </Header>
              <p>Tracespace View</p>
            </Menu.Item>
            <Menu.Item as="a">
              <Header as="h4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 8.47 8.47"
                  height="18"
                  style={{paddingRight: 10}}
                >
                  <rect
                    transform="translate(0 -288.53)"
                    fill="#9f5"
                    width="7.94"
                    height="7.94"
                    x=".27"
                    y="288.8"
                    ry="1.17"
                  />
                  <g transform="translate(0 -288.53)">
                    <rect
                      stroke-linejoin="round"
                      stroke-width=".4"
                      stroke="#000"
                      fill="none"
                      ry="1.17"
                      y="288.8"
                      x=".27"
                      height="7.94"
                      width="7.94"
                    />
                    <path
                      stroke-width=".4"
                      stroke="#000"
                      fill="#4d4d4d"
                      d="M1.06 290.12H3.7m-2.64 1.33H3.7m-2.64 1.32H3.7m-2.64 1.3H3.7m-2.64 1.33H3.7"
                    />
                    <path
                      stroke-width=".3"
                      stroke="#000"
                      fill="none"
                      d="M4.37 288.8v7.94m0-4.11h3.96"
                    />
                    <g
                      aria-label="FB"
                      font-weight="700"
                      font-size="3.17"
                      font-family="sans-serif"
                    >
                      <path d="M5.401 289.65h1.608v.45H5.997v.43h.952v.45h-.952v.98H5.4zM6.247 294.264q.14 0 .213-.062.073-.062.073-.183 0-.119-.073-.18-.073-.064-.213-.064h-.33v.489zm.02 1.01q.18 0 .27-.075.09-.076.09-.23 0-.15-.09-.224-.09-.076-.27-.076h-.35v.605zm.554-.83q.192.055.297.205.105.15.105.369 0 .334-.226.498-.226.164-.687.164h-.989v-2.31h.895q.481 0 .696.145.217.145.217.465 0 .17-.08.288-.078.118-.228.175z" />
                    </g>
                  </g>
                </svg>
                Assembly Guide
              </Header>
              <p>Interactive HTML BOM</p>
            </Menu.Item>
          </Menu>
        </div>
      </div>
    )
  }
})

module.exports = BoardShowcase
