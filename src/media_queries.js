//these are also defined in common.scss and need to be adjusted there and here
const small_width        = '(max-width: 768)'
const semantic_container = '(max-width: 1199)'
const mobile_m           = '(max-width: 458px)'

const mobile = `
  (orientation: portrait) and (max-device-width: 480px)
  , (orientation: landscape) and (max-device-width: 660px)
`

module.exports = {mobile, mobile_m, semantic_container, small_width}
