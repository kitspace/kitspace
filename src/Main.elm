import Graphics.Element exposing (..)
import Signal exposing (..)
import Window
import Text exposing (..)

--boardImage side w h =
--    image w h
--     ("../pcbs/bus-pirate-v3.6/svg/"
--         ++ side ++ ".svg")

boardImage side w h =
    image w h
--     ("../pcbs/arduino-uno/svg/"
     ("../pcbs/bus-pirate-v3.6/svg/"
         ++ side ++ ".png")

boardView w h =
    let spacerW = (w - 400) // 2
    in flow right
        [ spacer spacerW 1
        , boardImage "front" 400 300
        ]

titleView w h =
    let txt = leftAligned
        <| style
            {defaultStyle | height <- Just 32
                          , bold <- True
            }
        --<| fromString "Arduino UNO"
        <| fromString "BusPirate v3.6"
    in flow right [spacer ((w - widthOf txt) // 2) 1, txt]

view (w,h) =
    let boardH = max 100 (round (toFloat h / 3.3))
        titleH = max 100 (round (toFloat h / 3.3))
    in flow down
        [ spacer 1 20
        , titleView w titleH
        , spacer 1 20
        , boardView w boardH
        ]

main : Signal Element
main = map view Window.dimensions
