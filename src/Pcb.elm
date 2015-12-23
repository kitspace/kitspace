module Pcb where
import Graphics.Element exposing (..)
import Graphics.Collage exposing (..)
import Signal exposing (..)
import Window
import Text exposing (..)
import Color

--board = "arduino_Uno_Rev3-02-TH"
board = "BusPirate-v3.6-SSOP"

boardImage side w h =
    image w h
     ("../pcbs/" ++ board ++ "/svg/"
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
            {defaultStyle | height = Just 24
                          , bold   = True
                          , color  = Color.rgb 100 100 100
            }
        <| fromString board
        bg = collage w h [rect (toFloat w) (toFloat h) |> filled (Color.rgb 240 240 240)]
    in layers [bg, flow right [spacer 16 1, container w h midLeft txt]]

view (w,h) =
    let boardH = max 100 (round (toFloat h / 3.3))
        titleH = 64
    in flow down
        [ titleView w titleH
        , spacer 1 20
        , boardView w boardH
        ]

--main : Signal Element
--main = map view Window.dimensions
