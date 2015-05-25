import Graphics.Element exposing (..)
import Graphics.Collage exposing (..)
import Signal exposing (..)
import Window
import Text exposing (..)
import Color
import List exposing (intersperse, (::))

boards = ["Arduino UNO", "Bus Pirate"]

boardImage w h name =
    image w h ("../pcbs/" ++ name ++ "/images/front.png")

thumbnail w h name =
    let txt = centered
        <| Text.style
            {defaultStyle | height <- Just 16
                          , bold <- True
                          , color <- Color.rgb 55 55 55
            }
        <| fromString name
    in flow down
        [ boardImage w (h - 20) name
        , spacer 1 16
        , container w 20 middle txt
        ]

boardView w h = flow right <| (::) (spacer 32 1) <| intersperse (spacer 32 1) <| List.map (thumbnail 200 170) boards

searchBarView w h =
    let txt = leftAligned
        <| Text.style
            {defaultStyle | height <- Just 24
                          , bold <- True
                          , color <- Color.rgb 100 100 100
            }
        <| fromString ""
        bg = collage w h [rect (toFloat w) (toFloat h) |> filled (Color.rgb 240 240 240)]
        logo = container 165 h middle (image 163 48 "images/logo.png")
    in layers [bg, flow right [spacer (w - widthOf logo - 16) 1, logo, spacer 16 1]]

view (w,h) =
    let boardH = max 100 (round (toFloat h / 3.3))
    in flow down
        [ searchBarView w 64
        , spacer 1 20
        , boardView w (h - 64 - 20)
        ]

main : Signal Element
main = map view Window.dimensions

