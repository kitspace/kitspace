import Color
import Graphics.Collage exposing (..)
import Graphics.Element exposing (..)
import List exposing (..)
import Signal exposing (..)
import Text exposing (..)
import Window
import Debug

type alias BoardInfo =
    { name        : String
    , description : String
    , author      : String
    , version     : String
    , site        : String
    , license     : String
    }

emptyBoardInfo =
    { name        = ""
    , folder      = ""
    , description = ""
    , author      = ""
    , version     = ""
    , site        = ""
    , license     = ""
    }


boards = [ {emptyBoardInfo | name <- "Arduino UNO", folder <- "arduino-uno"}
         , {emptyBoardInfo | name <- "Bus Pirate" , folder <- "bus-pirate"}
         , {emptyBoardInfo | name <- "MC HCK" , folder <- "mchck"}
         ]

boardImage w h folder =
    image w h ("../pcbs/" ++ folder ++ "/images/front.png")

dim = {thumb = {w = 200, h = 150, capH = 30}}

thumb info =
    let txt = centered
        <| Text.style
            { defaultStyle | height <- Just 16
                           , bold   <- True
                           , color  <- Color.rgb 55 55 55
            }
        <| fromString info.name
    in flow right
        [ spacer 16 1
        , flow down
            [ boardImage dim.thumb.w dim.thumb.h info.folder
            , container dim.thumb.w dim.thumb.capH middle txt
            ]
        , spacer 16 1
        ]

boardView w h =
    let thumbs    = List.map thumb boards
        thumbRows = List.map row [0..nRows]
        nPerRow   = w // (dim.thumb.w + 32)
        nRows     = ceiling (toFloat (length thumbs) / toFloat nPerRow)
        row n     = take nPerRow (drop (n * nPerRow) thumbs)
    in flow down <| List.map (flow right) thumbRows

searchBarView w h =
    let bg = collage w h [rect (toFloat w) (toFloat h) |> filled (Color.rgb 240 240 240)]
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
main = Signal.map view Window.dimensions

