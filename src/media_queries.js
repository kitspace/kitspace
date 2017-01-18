//these are also defined in common.scss and need to be adjusted there and here
const mobile = `only screen
  and (min-device-width: 320px)
  and (max-device-width: 480px)
  , (orientation: landscape) and (max-device-width: 810px)
  , (handheld)
`
const mobile_or_small_width = `only screen
  and (min-device-width: 320px)
  and (max-device-width: 480px)
  , (orientation: landscape) and (max-device-width: 810px)
  , (handheld)
  , (max-width: 810px)
`
const small_width = '(max-width: 810px)'

module.exports = {mobile, mobile_or_small_width, small_width}
