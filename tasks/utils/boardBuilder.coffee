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
        _: " ._board-fr4 { color: dimgrey; }
             ._board-cu { color: lightgrey; }
             ._board-cf { color: #{options.cf[copperFinish].bg}; }
             ._board-sm { color: #{options.sm[solderMask].bg}; opacity: 0.75; }
             ._board-ss { color: #{options.ss[silkScreen].bg}; }
             ._board-sp { color: silver; opacity: 0.0;}
             ._board-out { color: black; }"

defaultStyle =
    copperFinish: 'gold'
    solderMask: 'green'
    silkScreen: 'white'

convert = (filenames, style = defaultStyle) ->
    layers = []
    for filename in filenames
        layerType = idLayer(filename)
        if layerType != 'drw' #drw is the default for any un-identifiable filenames
            gerberString = fs.readFileSync(filename, 'utf-8')
            try
                svgObj = gerberToSvg gerberString,
                    object: true
                    drill: (layerType == 'drl')
            catch e
                try
                    svgObj = gerberToSvg(gerberString, {object: true, drill: true})
                catch
                    console.warn "could not parse #{filename} as #{layerType} because
                                #{e.message}"
                    continue
                layerType = 'drl'
            layers.push({type: layerType, svg: svgObj})
    stackup = pcbStackup(layers)
    stackup.top.svg._.push(styleToSvgObj(style))
    stackup.bottom.svg._.push(styleToSvgObj(style))
    return stackup

module.exports = convert
