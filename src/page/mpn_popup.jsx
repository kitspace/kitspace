const React       = require('react')
const {h, a, div} = require('react-hyperscript-helpers')
const semantic    = require('semantic-ui-react')

const FadeImage = require('../fade_image')


const important = ['capacitance', 'resistance', 'case_package', 'resistance_tolerance', 'capacitance_tolerance']

function reorder(specs) {
  return specs.reduce((acc, spec) => {
    if (important.indexOf(spec.key) >= 0) {
      acc.unshift(spec)
    } else {
      acc.push(spec)
    }
    return acc
  }, [])
}

function MpnPopup(props) {
  const custom = {
    className       : 'MpnPopup',
    hoverable       : true,
    mouseLeaveDelay : 200,
    mouseEnterDelay : 200,
    position        : 'bottom left',
    trigger         : props.trigger,
    onOpen          : props.onOpen,
    onClose         : props.onClose,
    wide            : true,
  }
  const part = props.part
  const image = part.image || {}
  const specs = reorder(part.specs || [])
  return h(semantic.Popup, custom, [
    div({className: 'imageContainer'}, [
      h(semantic.Image, {src: image.url}),
    ]),
    a({href: props.datasheet}, 'datasheet'),
    h(semantic.Divider),
    div(props.description),
    h(semantic.Divider),
    h(semantic.Table, {very: true, basic: true, collapsing: true, celled: true}
    , specs.map(spec => {
      return h(semantic.Table.Row, [
        h(semantic.Table.Cell, spec.name),
        h(semantic.Table.Cell, spec.value),
      ])
    }))
  ])
}

module.exports = MpnPopup
