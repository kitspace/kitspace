const React = require('react')
const {h}   = require('react-hyperscript-helpers')
const {
  Label,
  Segment,
} = require('semantic-ui-react')

const board_colors = require('./board_colors')

module.exports = function ColorSelector(props) {
  function changeColor(color) {
    return () => {
      props.store.dispatch({type: 'setColor', value: color})
    }
  }
  const buttons = board_colors.map(color => {
      const selected = props.active === color ? 'selected' : ''
      return h(Label, {
        circular: true,
        className : `colorSelect ${selected}`,
        onClick   : changeColor(color),
        id        : `${color}Button`
      })
  })
  let yamlInfo
  if (props.yamlColor == null) {
    if (props.active !== 'green') {
      yamlInfo =
        <Label attached='bottom right'>
          {`Add a kitnic.yaml with "color: ${props.active}" to\
            your repo to use this color`}
        </Label>
    }
  }
  else if (props.yamlColor !== props.active) {
    yamlInfo =
      <Label attached='bottom right'>
        {`Change the color in your kitnic.yaml to "color: \
          ${props.active}" to use this color`}
      </Label>
  }
  return (
    <Segment className='colorSelector'>
      <Label>
        {'Select a color:'}
      </Label>
      {buttons}
      {yamlInfo}
    </Segment>
  )
}
