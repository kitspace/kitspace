//these are also defined in common.scss if adjustments need to be made, they
//need to be made there and here
const small_width = '(max-width: 946px)'
const semantic_container = '(max-width: 1199px)'
const mobile_m = '(max-width: 499px)'

const mobile = `
  (orientation: portrait) and (max-device-width: 480px)
  , (orientation: landscape) and (max-device-width: 660px)
`

module.exports = {mobile, mobile_m, semantic_container, small_width}
