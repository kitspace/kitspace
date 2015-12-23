module CustomGraphics where
-- Elm standard library
import List
import Graphics.Collage exposing (..)
import Graphics.Element exposing (..)
import Graphics.Element as Element
import Graphics.Input exposing (..)
import Text exposing (..)
import Text
import Color
import Signal

{-| An elliptical arc with the given center, radii and angle interval. -}
arc : (Float, Float) -> (Float, Float) -> (Float, Float) -> List (Float, Float)
arc (cx, cy) (a, b) (startAngle, endAngle) =
  let n = 50
      t = (endAngle - startAngle) / n
      f i = (cx + a * cos (t*i + startAngle), cy + b * sin (t*i + startAngle))
  in List.map f [0..n-1]

{-| A rounded rectangle element with a given width, height and a 5 degree
    corner radius -}
roundedRect : Int -> Int -> Int -> Color.Color -> Element
roundedRect w h r c =
    collage w h [filled c <| roundedRectShape All (toFloat w) (toFloat h) (toFloat r)]

type RoundedSide = Top | Left | Right | Bottom | All

roundedRectShape : RoundedSide -> Float -> Float -> Float -> Shape
roundedRectShape side  w h r =
  let hw = w/2
      hh = h/2
      (a,b,c,d) = case side of
        Top    -> (False,True ,True ,False)
        Bottom -> (True ,False,False,True)
        Left   -> (True ,True ,False,False)
        Right  -> (False,False,True ,True)
        _      -> (True ,True ,True ,True)
      aa = if a then (arc (0-hw+r, 0-hh+r) (r, r) (270 |> degrees, 180 |> degrees))
           else [(0,-hh),(-hw,-hh),(-hw,0)]
      bb = if b then (arc (0-hw+r, hh-r) (r, r) (180 |> degrees, 90 |> degrees))
           else [(-hw,0),(-hw,hh),(0,hh)]
      cc = if c then (arc (hw-r, hh-r) (r, r) (90 |> degrees, 0 |> degrees))
           else [(0,hh),(hw,hh),(hw,0)]
      dd = if d then (arc (hw-r, 0-hh+r) (r, r) (0 |> degrees, -90 |> degrees))
           else [(hw,0),(hw,-hh),(0,-hh)]
  in polygon (aa ++ bb ++ cc ++ dd)
