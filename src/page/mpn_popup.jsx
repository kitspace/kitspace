const React       = require('react')
const {h, a, div} = require('react-hyperscript-helpers')
const semantic    = require('semantic-ui-react')
const ramda       = require('ramda')

const FadeImage = require('../fade_image')


const importance = [
  ['capacitance', 'resistance'],
  ['case_package'],
  ['dielectric_characteristic'],
  ['resistance_tolerance', 'capacitance_tolerance'],
  ['voltage_rating', 'power_rating'],
  ['case_package_si'],
]

function reorder(specs) {
  const groups = specs.reduce((acc, spec) => {
    let index = importance.reduce((prev, keys, index) => {
      if (keys.indexOf(spec.key) >= 0) {
        return index
      }
      return prev
    }, null)
    if (index == null) {
      index = acc.length - 1
    }
    acc[index].push(spec)
    return acc
  }, importance.map(x => []).concat([[]]))
  return ramda.flatten(groups)
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
    div({className: 'topAreaContainer'}, [
      div({style: {fontSize: 10}}, [
        div({className: 'imageContainer'}, [
          h(semantic.Image, {src: image.url}),
        ]),
        a({href: image.credit_url}, image.credit_string),
      ]),
      div({className: 'linkContainer datasheetLinkContainer'}, [
        div([a({href: part.datasheet}, [
          h(semantic.Icon, {name: 'file pdf outline'}),
          'Datasheet'
        ])])
      ]),
    ]),
    h(semantic.Divider),
    div(part.description),
    h(semantic.Table, {basic: 'very', collapsing: true, celled: true}
    , specs.slice(0,4).map(spec => {
      return h(semantic.Table.Row, [
        h(semantic.Table.Cell, spec.name),
        h(semantic.Table.Cell, spec.value),
      ])
    })),
    h(semantic.Button, {fluid: true},  '...'),
    h(semantic.Divider),
    div({className: 'linkContainer octopartLinkContainer'}, [
      a({href: 'https://octopart.com/'}, 'Powered by Octopart')
    ]),
  ])
}

module.exports = MpnPopup
