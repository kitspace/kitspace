//these are also defined in common.scss and need to be adjusted there and here
const mobile = `
  (orientation: portrait) and (max-device-width: 480px)
  , (orientation: landscape) and (max-device-width: 660px)
`
const mobile_or_small_width = `
  (orientation: portrait) and (max-device-width: 480px)
  , (orientation: landscape) and (max-device-width: 660px)
  , (max-width: 810px)
`
const small_width = '(max-width: 810px)'

module.exports = {mobile, mobile_or_small_width, small_width}
