module Image where

import Graphics.Element exposing (Element, empty)
import Html exposing (..)
import Html.Attributes as Attributes

image' : Int -> String -> Element
image' h path =
   let style = Attributes.style [("height", toString h ++ "px")]
   in empty --toElement <| img [Attributes.src path, style] []
