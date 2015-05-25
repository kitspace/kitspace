import Graphics.Element exposing (..)
import Graphics.Collage exposing (..)
import Signal exposing (..)
import Window
import Text exposing (..)
import Color

titleView w h =
    let txt = leftAligned
        <| Text.style
            {defaultStyle | height <- Just 24
                          , bold <- True
                          , color <- Color.rgb 100 100 100
            }
        <| fromString ""
        bg = collage w h [rect (toFloat w) (toFloat h) |> filled (Color.rgb 240 240 240)]
        logo = container 163 64 middle (image 163 48 "images/logo.png")
    in layers [bg, flow right [spacer (w - widthOf logo - 16) 1, logo, spacer 16 1]]

view (w,h) =
    let boardH = max 100 (round (toFloat h / 3.3))
        titleH = 64
    in flow down
        [ titleView w titleH
        , spacer 1 20
        ]

main : Signal Element
main = map view Window.dimensions

