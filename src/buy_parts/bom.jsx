const React = require('react')
const DoubleScrollbar = require('react-double-scrollbar')
const semantic = require('semantic-ui-react')

const TsvTable = require('./tsv_table')

module.exports = props => {
  return (
    <div className="Bom">
      <DoubleScrollbar>
        <TsvTable
          parts={props.parts}
          tsv={props.tsv}
          collapsed={props.collapsed}
          setCollapsed={props.setCollapsed}
        />
      </DoubleScrollbar>
      <ExpandBom
        diff={props.length - 4}
        collapsed={props.collapsed}
        setCollapsed={props.setCollapsed}
      />
    </div>
  )
}

function ExpandBom(props) {
  if (props.diff > 0) {
    if (props.collapsed) {
      var summary = (
        <tr className='expandSummary'>
          <semantic.Table.Cell
            textAlign="center"
          >
            {`... ${props.diff} more line${props.diff > 1 ? 's' : ''}`}
          </semantic.Table.Cell>
        </tr>
      )
    }
    return (
      <div style={{paddingLeft:1, paddingRight:1}}>
        <semantic.Table
          className="expandBomTable"
          attached="bottom"
          celled
          singleLine
          unstackable
          style={{
            borderTop: 0,
            cursor: 'pointer',
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
