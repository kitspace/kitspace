import Graphics.Element exposing (..)
import Signal exposing (..)
import Window
import Text exposing (..)

import Image exposing (..)

--boardImage side w h =
--    image w h
--     ("../pcbs/bus-pirate-v3.6/svg/"
--         ++ side ++ ".svg")

boardImage side w h =
    image' h
     ("../pcbs/arduino-uno/svg/"
         ++ side ++ ".svg")




boardView w h =
    let boardW  = (w - (spacerW*2) - 64) // 2
        spacerW = w // 16
        boards =
            [ boardImage "front" boardW h
            , spacer 64 1
            , boardImage "back" boardW h
            ]
    in flow right
        [ spacer spacerW 1
        ]

titleView w h =
    let txt = leftAligned
        <| style
            {defaultStyle | line <- Just Under
                          , height <- Just 26
            }
        <| fromString "Arduino UNO"
    in flow right [spacer ((w - widthOf txt) // 2) 1, txt]

view (w,h) =
    let boardH = max 100 (round (toFloat h / 3.3))
        titleH = max 100 (round (toFloat h / 3.3))
    in flow down
        [ spacer 1 10
        , titleView w titleH
        , spacer 1 10
        , boardView w boardH
        ]

main : Signal Element
main = map view Window.dimensions
