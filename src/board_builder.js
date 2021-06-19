const pcbStackup = require('pcb-stackup')
const xmlElementString = require('xml-element-string')

const options = {
  // copper finish
  cf: {
    bare: '#C87533',
    gold: 'goldenrod',
    'Ni/Au': 'whitesmoke',
    hasl: 'silver'
  },

  // soldermask
  sm: {
    red: 'rgba(139,   0,   0, 0.90)',
    orange: 'rgba(195, 107,   0, 0.90)',
    yellow: 'rgba(255, 255, 102, 0.50)',
    green: 'rgba(  0,  68,   0, 0.90)',
    blue: 'rgba(  0,  30, 104, 0.90)',
    purple: 'rgba( 46,   0,  81, 0.90)',
    black: 'rgba(  0,   0,   0, 0.90)',
    white: 'rgba(255, 255, 255, 0.90)'
  },

  // silkscreen
  ss: {
    red: 'red',
    yellow: 'yellow',
    green: 'green',
    blue: 'blue',
    black: 'black',
    white: 'white'
  }
}

const styleToOption = ({copperFinish, solderMask, silkScreen}) => ({
  fr4: '#4D542C',
  cu: 'lightgrey',
  cf: options.cf[copperFinish],
  sm: options.sm[solderMask],
  ss: options.ss[silkScreen],
  sp: 'rgba(0, 0, 0, 0.0)',
  out: 'black'
})

const colorToStyle = {
  green: {
    solderMask: 'green',
    copperFinish: 'gold',
    silkScreen: 'white'
  },
  red: {
    solderMask: 'red',
    copperFinish: 'gold',
    silkScreen: 'white'
  },
  blue: {
    solderMask: 'blue',
    copperFinish: 'hasl',
    silkScreen: 'white'
  },
  black: {
    solderMask: 'black',
    copperFinish: 'hasl',
    silkScreen: 'white'
  },
  white: {
    solderMask: 'white',
    copperFinish: 'gold',
    silkScreen: 'black'
  },
  orange: {
    solderMask: 'orange',
    copperFinish: 'hasl',
    silkScreen: 'white'
  },
  purple: {
    solderMask: 'purple',
    copperFinish: 'gold',
    silkScreen: 'white'
  },
  yellow: {
    solderMask: 'yellow',
    copperFinish: 'gold',
    silkScreen: 'black'
  }
}

function styleString(options) {
  return `/* <![CDATA[ */.pcb-stackup_fr4 {color: ${options.fr4};}
  .pcb-stackup_cu {color: ${options.cu};}
  .pcb-stackup_cf {color: ${options.cf};}
  .pcb-stackup_sm {color: ${options.sm};}
  .pcb-stackup_ss {color: ${options.ss};}
  .pcb-stackup_sp {color: ${options.sp};}
  .pcb-stackup_out {color: ${options.out};}/* ]]> */`
}

module.exports = (layers, color, callback, createElement) => {
  return pcbStackup(
    layers,
    {
      color: styleToOption(colorToStyle[color]),
      outlineGapFill: 1.27,
      id: 'pcb-stackup',
      createElement: createElement || xmlElementString
    },
    callback
  )
}

module.exports.getStyle = function getStyle(color) {
  return styleString(styleToOption(colorToStyle[color]))
}

function hash(str) {
  return crypto
    .createHash('sha1')
    .update(str)
    .digest('hex')
    .slice(0, 7)
}
