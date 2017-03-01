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

function chunkArray(arr, chunkSize) {
    var groups = [], i;
    for (i = 0; i < arr.length; i += chunkSize) {
        groups.push(arr.slice(i, i + chunkSize));
    }
    return groups;
}

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

function specRow(spec) {
  return h(semantic.Table.Row, [
    h(semantic.Table.Cell, spec.name),
    h(semantic.Table.Cell, spec.value),
  ])
}

const MpnPopup = React.createClass({
  getInitialState() {
    return {expanded: false}
  },
  toggleExpand() {
    this.setState({expanded: !this.state.expanded})
  },
  render() {
    const props = this.props
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
      flowing         : this.state.expanded,
    }
    const part      = props.part
    const image     = part.image || {}
    const specs     = reorder(part.specs || [])
    let tableData
    if (this.state.expanded) {
      tableData = chunkArray(specs, 4).map(group => {
        return ramda.flatten(group.map(spec => ['', spec.name, spec.value]))
      })
    }
    else {
      tableData = specs.slice(0, 4).map(spec => [spec.name, spec.value])
    }
    const table = h(semantic.Table, {
        basic      : 'very',
        collapsing : true,
        celled     : true,
        tableData,
        renderBodyRow(args) {
          return h(semantic.Table.Row, args.map(text => {
            return h(semantic.Table.Cell, text)
          }))
        },
    })
    return h(semantic.Popup, custom, [
      div({className: 'topAreaContainer'}, [
        div({style: {fontSize: 10}}, [
          div({className: 'imageContainer'}, [
            h(semantic.Image, {src: image.url}),
          ]),
          a({href: image.credit_url}, image.credit_string),
        ]),
        div({className: 'linkContainer'}, [
          div([a({href: part.datasheet}, [
            h(semantic.Icon, {name: 'file pdf outline'}),
            'Datasheet'
          ])])
        ]),
      ]),
      h(semantic.Divider),
      div(part.description),
      table,
      h(semantic.Button, {
        onClick: this.toggleExpand,
        fluid: true,
        basic: true,
      }, this.state.expanded ? '⇡' : '...'),
      h(semantic.Divider),
      div({className: 'linkContainer octopartLinkContainer'}, [
        a({href: 'https://octopart.com/'}, 'Powered by Octopart')
      ]),
    ])
  },
})

module.exports = MpnPopup
