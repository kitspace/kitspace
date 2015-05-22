import Graphics.Element exposing (..)
import Signal exposing (..)
import Window

boardImage side w =
    let aspect = 37 / 60
    --let aspect = 2.1 / 2.7
    in image
        w
        (round (toFloat w * aspect))
        ("../pcbs/bus-pirate-v3.6/svg/"
            ++ side ++ ".svg")


boardView w =
    let boardW        = (w - (spacerW*3)) // 2
        spacerW       = w // 16
        maxH          = 400
        frontExpanded = boardImage "front" boardW
        boardH        = heightOf frontExpanded
    in flow right
        [ spacer spacerW 1
        , if boardH < maxH then frontExpanded else height maxH frontExpanded
        , spacer spacerW 1
        , boardImage "back" boardW
        ]

view (w,h) = flow down [spacer 1 64, boardView w]

main : Signal Element
main = map view Window.dimensions
