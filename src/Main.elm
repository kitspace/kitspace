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
import Graphics.Input exposing (..)
import CustomGraphics exposing (..)
import Html
import Html.Attributes
import String

type alias BoardInfo =
    { name        : String
    , folder      : String
    , description : String
    , author      : String
    , site        : String
    , license     : String
    }

boardDecoder : Decoder BoardInfo
boardDecoder =
    object6 BoardInfo
        ("name"        := string)
        ("folder"      := string)
        ("description" := string)
        ("author"      := string)
        ("site"        := string)
        ("license"     := string)

boardMB : Signal.Mailbox (List BoardInfo)
boardMB = Signal.mailbox []

boardJsonUrl = "boards.json"

port getBoards : Task Http.Error ()
port getBoards = Http.get (list boardDecoder) boardJsonUrl
                    `Task.andThen` Signal.send boardMB.address


buttonMB : Signal.Mailbox ()
buttonMB = Signal.mailbox ()

dim = {thumb = {w = 300, h = 225, capH = 30}}

boardImage w h folder =
    image w h ("boards/" ++ folder ++ "/images/thumb.png")

thumb info =
    let txt = centered
        <| Text.style
            { defaultStyle | height = Just 16
                           , bold   = True
                           , color  = Color.rgb 55 55 55
            }
        <| fromString (String.join "  /  " (String.split "/" info.folder))
        w = dim.thumb.w + 32
        h = dim.thumb.h + dim.thumb.capH + 32
        img height = container w height middle
                <| flow down
                    [ boardImage dim.thumb.w dim.thumb.h info.folder
                    , container dim.thumb.w dim.thumb.capH middle txt
                    ]
        up = layers
            [ roundedRect w h 10 (Color.rgb 0xF0 0xF0 0xF0)
            , img h
            ]

        hover = layers
            [ roundedRect w h 10 (Color.rgb 0xCF 0xCF 0xCF)
            , img h
            ]
    in customButton (message buttonMB.address ()) up hover hover

boardView w boards =
    let thumbs    = List.map thumb boards
        thumbRows = List.map row [0..nRows]
        nPerRow   = max 1 (w // (dim.thumb.w + 32 + 16))
        nRows     = ceiling (toFloat (length thumbs) / toFloat nPerRow)
        row n     = (spacer 16 16) :: (
            List.intersperse (spacer 16 16)
                <| take nPerRow (drop (n * nPerRow) thumbs))
        rows = flow down
            <| List.intersperse (spacer 16 16)
                <| List.map (flow right) thumbRows
    in rows

searchBarView w h =
    let style =
            Html.Attributes.style
                [("box-shadow", "0px 0.1em 0.5em #000")]
    in layers
            [ Html.toElement w 80
                <| Html.div [style]
                [ Html.fromElement
                    <| collage w 80
                        [rect (toFloat w) 120 |> filled (Color.rgb 0x40 0x40 0x40)]
                ]
            , flow right
                [ spacer 20 1
                , flow down
                    [ spacer 0 20
                    , image 137 50 "images/logo.png"
                    ]
                ]
            ]

view (w,h) boards =
    flow down
        [ searchBarView w 64
        , spacer 1 20
        , boardView w boards
        , spacer 1 20
        ]

main : Signal Element
main = Signal.map2 view Window.dimensions boardMB.signal

