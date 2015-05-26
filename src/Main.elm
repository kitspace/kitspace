import Color
import Graphics.Collage exposing (..)
import Graphics.Element exposing (..)
import List exposing (..)
import Signal exposing (..)
import Text exposing (..)
import Task exposing (..)
import Http
import Window
import Debug
import Json.Decode exposing (..)

type alias BoardInfo =
    { name        : String
    , folder      : String
    , description : String
    , author      : String
    , version     : String
    , site        : String
    , license     : String
    }

boardDecoder : Decoder BoardInfo
boardDecoder =
    object7 BoardInfo
        ("name"        := string)
        ("folder"      := string)
        ("description" := string)
        ("author"      := string)
        ("version"     := string)
        ("site"        := string)
        ("license"     := string)

boardMB : Signal.Mailbox (List BoardInfo)
boardMB = Signal.mailbox []

boardJsonUrl = "boards.json"

port getBoards : Task Http.Error ()
port getBoards = Http.get (list boardDecoder) boardJsonUrl
                    `Task.andThen` Signal.send boardMB.address

dim = {thumb = {w = 200, h = 150, capH = 30}}

boardImage w h folder =
    image w h ("../pcbs/" ++ folder ++ "/images/thumb.png")

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

boardView w h boards =
    let thumbs    = List.map thumb boards
        thumbRows = List.map row [0..nRows]
        nPerRow   = max 1 (w // (dim.thumb.w + 32))
        nRows     = ceiling (toFloat (length thumbs) / toFloat nPerRow)
        row n     = take nPerRow (drop (n * nPerRow) thumbs)
        rows = flow down <| List.map (flow right) thumbRows
    in container w h midTop rows

searchBarView w h =
    let bg = collage w h
            [rect (toFloat w) (toFloat h) |> filled (Color.rgb 240 240 240)]
        logo = container 165 h middle (image 163 48 "images/logo.png")
    in layers [bg, flow right [spacer (w - widthOf logo - 16) 1, logo, spacer 16 1]]

view (w,h) boards =
    flow down
        [ searchBarView w 64
        , spacer 1 20
        , boardView w (h - 64 - 20) boards
        ]

main : Signal Element
main = Signal.map2 view Window.dimensions boardMB.signal

