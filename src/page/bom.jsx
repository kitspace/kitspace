'use strict'
const React           = require('react')
const DoubleScrollbar = require('react-double-scrollbar')
const {table, thead, tbody, tr, th, td} = require('react-hyperscript-helpers')

//for react-double-scrollbar in IE11
require('babel-polyfill')

function tsvToTable(tsv) {
  const lines = tsv.split('\n').slice(0, -1)
  const headings = lines[0].split('\t')
  let headingJSX = headings.map((text) => {
    return th(text)
  })
  headingJSX = thead([tr(headingJSX)])
  const markPink = (index) => {
    return ['Manufacturer', 'MPN', 'Description']
      .indexOf(headings[index]) < 0
  }
  const bodyJSX = tbody(lines.slice(1).map((line, rowIndex) => {
    line = line.split('\t')
    return tr(`.tr${rowIndex % 2}`, line.map((text, columnIndex) => {
      let style = {}
      if (markPink(columnIndex) && text == '') {
        style = {backgroundColor:'pink'}
      }
      return td({style: style}, text)
    }))
  }))
  return table('.bomTable', [headingJSX, bodyJSX])
}

let BOM = React.createClass({
  propTypes: {
    data: React.PropTypes.object.isRequired
  },
  render: function () {
    //get rid of this once proper BOMs are made a requirement and enforced
    //much earlier
    if (this.props.data.lines.length === 0) {
      return (<div>{'no BOM yet'}</div>)
    }
    return (
      <div className='bom'>
        <div className='bomTableContainer'>
          <DoubleScrollbar>
          {tsvToTable(this.props.data.tsv)}
          </DoubleScrollbar>
          </div>
      </div>
    )
  }
})

module.exports = BOM
