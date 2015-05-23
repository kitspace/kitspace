import Graphics.Element exposing (..)
import Signal exposing (..)
import Window

--boardImage side w h =
--    image w h
--     ("../pcbs/bus-pirate-v3.6/svg/"
--         ++ side ++ ".svg")

boardImage side w h =
    image w h
     ("../pcbs/arduino-uno/svg/"
         ++ side ++ ".svg")


boardView w h =
    let boardW  = (w - (spacerW*3)) // 2
        spacerW = w // 16
        maxH    = max 100 (round (toFloat h / 3.3))
    in flow right
        [ spacer spacerW 1
        , boardImage "front" boardW maxH
        , spacer spacerW 1
        , boardImage "back" boardW maxH
        ]

view (w,h) = flow down [spacer 1 10, boardView w h]

main : Signal Element
main = map view Window.dimensions
