const React = require('react')
const DoubleScrollbar = require('react-double-scrollbar')
const semantic = require('semantic-ui-react')

const TsvTable = require('./tsv_table')

module.exports = props => {
  return (
    <div>
      <DoubleScrollbar>
        <TsvTable
          parts={props.parts}
          tsv={props.tsv}
          collapsed={props.collapsed}
        />
      </DoubleScrollbar>
      <ExpandBom
        collapsed={props.collapsed}
        setCollapsed={props.setCollapsed}
      />
    </div>
  )
}

function ExpandBom(props) {
  return (
    <semantic.Button
      style={{backgroundColor:'#ededed'}}
      attached="bottom"
      colSpan={props.colSpan}
      onClick={() => {
        props.setCollapsed(!props.collapsed)
      }}
    >
      <semantic.Icon name={props.collapsed ? 'eye' : 'arrow up'} />
      {props.collapsed ? 'View All' : 'Hide'}
    </semantic.Button>
  )
}
