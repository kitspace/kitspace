const React    = require('react')
const {h, a}      = require('react-hyperscript-helpers')
const semantic = require('semantic-ui-react')


function MpnPopup(props) {
  const custom = {
    hoverable: true,
    mouseLeaveDelay: 200,
    mouseEnterDelay: 200,
    position: 'bottom left'
  }
  return h(semantic.Popup, Object.assign(custom, props), [
    a({href: props.datasheet}, 'datasheet'),
  ])
}

module.exports = MpnPopup
