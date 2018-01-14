const React = require('react')
const DoubleScrollbar = require('react-double-scrollbar')
const semantic = require('semantic-ui-react')

const TsvTable = require('./tsv_table')

module.exports = props => {
  let diff = props.length - 7
  let collapsed = props.collapsed
  if (diff < 2) {
    diff = 0
    collapsed = false
  }
  return (
    <div className="Bom">
      <DoubleScrollbar>
        <TsvTable parts={props.parts} tsv={props.tsv} collapsed={collapsed} />
      </DoubleScrollbar>
      <ExpandBom
        diff={diff}
        collapsed={collapsed}
        setCollapsed={props.setCollapsed}
      />
    </div>
  )
}

function ExpandBom(props) {
  if (props.diff > 0) {
    if (props.collapsed) {
      var summary = (
        <tr className="expandSummary">
          <semantic.Table.Cell textAlign="center">
            {`... ${props.diff} more lines`}
          </semantic.Table.Cell>
        </tr>
      )
    }
    return (
      <div style={{paddingLeft: 1, paddingRight: 1}}>
        <semantic.Table
          className="expandBomTable"
          attached="bottom"
          celled
          singleLine
          unstackable
          style={{
            borderTop: 0,
            cursor: 'pointer'
          }}
          onClick={() => props.setCollapsed(!props.collapsed)}
        >
          <tbody>
            {summary}
            <tr style={{borderTop: 0}}>
              <semantic.Table.Cell textAlign="center">
                <semantic.Icon name={props.collapsed ? 'eye' : 'arrow up'} />
                {props.collapsed ? 'View All' : 'Hide'}
              </semantic.Table.Cell>
            </tr>
          </tbody>
        </semantic.Table>
      </div>
    )
  }
  return <div />
}
