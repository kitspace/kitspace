fs          = require('fs')
pcbStackup  = require('pcb-stackup')
idLayer     = require('pcb-stackup/lib/layer-types').identify
gerberToSvg = require('gerber-to-svg')

# board colors
options = {
  # copper finish
  cf: {
    bare:    { bg: '#C87533',       txt: 'white' }
    gold:    { bg: 'goldenrod',     txt: 'white' }
    'Ni/Au': { bg: 'whitesmoke',    txt: 'black' }
    hasl:    { bg: 'silver',        txt: 'black' }
  }
  # soldermask
  sm: {
    red:    { bg: 'darkred',    txt: 'white' }
    orange: { bg: 'darkorange', txt: 'black' }
    yellow: { bg: '#FFFF66',    txt: 'black' }
    green:  { bg: 'darkgreen',  txt: 'white' }
    blue:   { bg: 'navy',       txt: 'white' }
    purple: { bg: 'indigo',     txt: 'white' }
    black:  { bg: 'black',      txt: 'white' }
    white:  { bg: 'white',      txt: 'black' }
  }
  # silkscreen
  ss: {
    red:    { bg: 'red',    txt: 'white' }
    yellow: { bg: 'yellow', txt: 'black' }
    green:  { bg: 'green',  txt: 'white' }
    blue:   { bg: 'blue',   txt: 'white' }
    black:  { bg: 'black',  txt: 'white' }
    white:  { bg: 'white',  txt: 'black' }
  }
}

styleToSvgObj = ({copperFinish, solderMask, silkScreen}) ->
    style:
        type: 'text/css',
        _: " ._board-fr4 { color: #867C48; }
             ._board-cu { color: lightgrey; }
             ._board-cf { color: #{options.cf[copperFinish].bg}; }
             ._board-sm { color: #{options.sm[solderMask].bg}; opacity: 0.75; }
             ._board-ss { color: #{options.ss[silkScreen].bg}; }
             ._board-sp { color: silver; opacity: 0.0;}
             ._board-out { color: black; }"


colorToStyle =
    green:
        solderMask: 'green'
        copperFinish: 'gold'
        silkScreen: 'white'
    red:
        solderMask: 'red'
        copperFinish: 'gold'
        silkScreen: 'white'
    blue:
        solderMask: 'blue'
        copperFinish: 'hasl'
        silkScreen: 'white'
    black:
        solderMask: 'black'
        copperFinish: 'hasl'
        silkScreen: 'white'
    white:
        solderMask: 'white'
        copperFinish: 'gold'
        silkScreen: 'black'
    orange:
        solderMask: 'orange'
        copperFinish: 'hasl'
        silkScreen: 'white'
    purple:
        solderMask: 'purple'
        copperFinish: 'gold'
        silkScreen: 'white'
    yellow:
        solderMask: 'yellow'
        copperFinish: 'bare'
        silkScreen: 'black'

convert = (filenames, color = 'green') ->
    layers = []
    for filename in filenames
        layerType = idLayer(filename)
        if layerType != 'drw' #drw is the default for any un-identifiable filenames
            gerberString = fs.readFileSync(filename, 'utf-8')
            try
                svgObj = gerberToSvg gerberString,
                    object: true
                    drill: (layerType == 'drl')
                    warnArr: []
            catch e
                try
                    svgObj = gerberToSvg(gerberString, {object: true, drill: true, warnArr: []})
                catch
                    console.warn "could not parse #{filename} as #{layerType} because
                                #{e.message}"
                    continue
                layerType = 'drl'
            layers.push({type: layerType, svg: svgObj})
    stackup = pcbStackup(layers)
    stackup.top.svg._.push(styleToSvgObj(colorToStyle[color]))
    stackup.bottom.svg._.push(styleToSvgObj(colorToStyle[color]))
    return stackup

module.exports = convert
