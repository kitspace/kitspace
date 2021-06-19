const React = require('react')
const createClass = require('create-react-class')
const semantic = require('semantic-ui-react')
const {h, tbody, tr, td} = require('react-hyperscript-helpers')
const ramda = require('ramda')

const MpnPopup = require('./mpn_popup')

function markerColor(ref) {
  if (/^C\d/.test(ref)) {
    return 'orange'
  }
  if (/^R\d/.test(ref)) {
    return 'lightblue'
  }
  if (/^IC\d/.test(ref) || /^U\d/.test(ref)) {
    return 'blue'
  }
  if (/^L\d/.test(ref)) {
    return 'black'
  }
  if (/^D\d/.test(ref)) {
    return 'green'
  }
  if (/^LED\d/.test(ref)) {
    return 'yellow'
  }
  return 'purple'
}

const TsvTable = createClass({
  getInitialState() {
    return {
      activePopup: null
    }
  },
  mpnCells(contents, rowIndex, columnIndex) {
    const activePopup = this.state.activePopup
    const active =
      activePopup &&
      activePopup[0] === rowIndex &&
      activePopup[1] === columnIndex
    const cells = contents.map(t => h(semantic.Table.Cell, {active}, t))
    const number = contents[1]
    if (number !== '') {
      const setActivePopup = () => {
        this.setState({activePopup: [rowIndex, columnIndex]})
      }
      const setInactivePopup = () => {
        if (active) {
          this.setState({activePopup: null})
        }
      }
      const part =
        this.props.parts.reduce((prev, part) => {
          if (prev) {
            return prev
          }
          if (part && part.mpn && part.mpn.part === number) {
            return part
          }
        }, null) || {}
      return cells.map(cell => {
        return h(MpnPopup, {
          onOpen: setActivePopup,
          onClose: setInactivePopup,
          trigger: cell,
          part: part
        })
      })
    }
    return cells
  },
  render() {
    const tsv = this.props.tsv
    const lines = tsv
      .split('\n')
      .slice(0, -1)
      .map(line => line.split('\t'))
    let columns = lines.slice(1).reduce(
      (prev, line) => {
        return prev.map((column, index) => {
          return column.concat([line[index]])
        })
      },
      lines[0].map(t => [t])
    )

    //get rid of empty columns
    columns = columns.filter(column => {
      //always keep Manufacturer though
      if (column[0] === 'Manufacturer') {
        return true
      }
      return column.slice(1).filter(x => x).length
    })

    const numberOfLines = this.props.collapsed ? 8 : undefined
    const reducedLines = columns.slice(1).reduce(
      (prev, column) => {
        return prev.map((line, index) => {
          return line.concat([column[index]])
        })
      },
      columns[0].slice(0, numberOfLines).map(c => [c])
    )

    const headings = reducedLines[0]
    const bodyLines = reducedLines.slice(1)
    let headingJSX = headings.map(text => h(semantic.Table.HeaderCell, text))
    headingJSX = h(semantic.Table.Header, [h(semantic.Table.Row, headingJSX)])
    const bodyLinesJSX = bodyLines.map((line, rowIndex) => {
      const grouped = line.reduce((grouped, text, columnIndex) => {
        const heading = headings[columnIndex]
        if (heading === 'Manufacturer') {
          return grouped.concat([[text]])
        }
        if (heading === 'MPN') {
          grouped[grouped.length - 1].push(text)
          return grouped
        }
        return grouped.concat([text])
      }, [])
      const groupedHeadings = headings.filter(h => h !== 'Manufacturer')
      function markPink(columnIndex) {
        //mark pink empty cells in all columns except these
        return ['Description'].indexOf(groupedHeadings[columnIndex]) < 0
      }
      const bodyCells = grouped.map((contents, columnIndex) => {
        if (typeof contents === 'object') {
          return this.mpnCells(contents, rowIndex, columnIndex)
        }
        const error = markPink(columnIndex) && contents === ''
        const className =
          columnIndex === 0 ? 'marked ' + markerColor(contents) : ''
        const cell = h(
          semantic.Table.Cell,
          {
            error,
            className
          },
          contents
        )
        return cell
      })
      const activePopup = this.state.activePopup
      const rowActivePopup = activePopup && activePopup[0] === rowIndex
      const className = rowActivePopup ? 'selected' : ''
      return h(semantic.Table.Row, {className}, ramda.flatten(bodyCells))
    })
    const bodyJSX = tbody(bodyLinesJSX)
    const tableProps = {
      selectable: !this.state.activePopup,
      celled: true,
      unstackable: true,
      singleLine: true,
      size: 'small',
      className: 'TsvTable' + (this.props.collapsed ? ' collapsed' : '')
    }
    return h(semantic.Table, tableProps, [headingJSX, bodyJSX])
  }
})

module.exports = TsvTable
