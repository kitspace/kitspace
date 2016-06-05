pcbStackup  = require('pcb-stackup')
idLayer     = require('pcb-stackup/lib/layer-types').identify
gerberToSvg = require('gerber-to-svg')

# board colors
options =
    # copper finish
    cf:
        bare    : '#C87533'
        gold    : 'goldenrod'
        'Ni/Au' : 'whitesmoke'
        hasl    : 'silver'

    # soldermask
    sm:
        red    : 'rgba(0x8B,    0,    0, 0.90)'
        orange : 'rgba(0xC3, 0x6B,    0, 0.90)'
        yellow : 'rgba(0xFF, 0xFF, 0x66, 0.50)'
        green  : 'rgba(   0, 0x40,    0, 0.90)'
        blue   : 'rgba(   0, 0x1E, 0x68, 0.90)'
        purple : 'rgba(0x2E,    0, 0x51, 0.90)'
        black  : 'rgba(   0,    0,    0, 0.90)'
        white  : 'rgba(0xFF, 0xFF, 0xFF, 0.90)'

    # silkscreen
    ss:
        red    : 'red'
        yellow : 'yellow'
        green  : 'green'
        blue   : 'blue'
        black  : 'black'
        white  : 'white'


styleToSvgObj = ({copperFinish, solderMask, silkScreen}) ->
    style:
        type: 'text/css',
        _: " ._board-fr4 { color: #4D542C;}
             ._board-cu { color: lightgrey; }
             ._board-cf { color: #{options.cf[copperFinish]}; }
             ._board-sm { color: #{options.sm[solderMask].color}; opacity: #{options.sm[solderMask].opacity}; }
             ._board-ss { color: #{options.ss[silkScreen]}; }
             ._board-sp { color: silver; opacity: 0.0;}
             ._board-out { color: black; }"

styleToOption = ({copperFinish, solderMask, silkScreen}) ->
            fr4: '#4D542C'
            cu: 'lightgrey'
            cf: options.cf[copperFinish]

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
        copperFinish: 'gold'
        silkScreen: 'black'

convert = (layers, color, callback) ->
    pcbStackup layers,
        color:


module.exports = convert
