const React = require('react')
const Markdown = require('react-markdown')
const semantic = require('semantic-ui-react')
const ReactSearchInput = require('react-search-input')
const TitleBar = require('../title_bar')

const text = `
# The Kitspace BOM Builder

The BOM Builder allows you to automatically find in-stock components and alternatives across distributors. It also lets you add entire bill of materials directly to shopping carts by connecting up to [1-click BOM](https://1clickbom.com).

You can easily select alternatives for line items even for generic components such as resistors and capacitors. The aim is to cut the purchasing time down from several hours to a few minutes and quickly buy alternatives when parts go out of stock at your preferred distributor.

We are now in a closed beta phase so if you are interested in trying it out please [get in touch](mailto:info@kitspace.org?subject=BOM%20Builder).

A quick demo of the alpha version:

<iframe width="560" height="315" src="https://www.youtube.com/embed/m96G7B1doRQ" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>

A longer video going through all of the features of the beta version:

<iframe width="560" height="315" src="https://www.youtube.com/embed/U7GB7RV1VzE" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>

`

function BomBuilder(props) {
  return (
    <div>
      <TitleBar route="/bom_builder" />
      <semantic.Container style={{marginTop: 30}}>
        <Markdown source={text} />
      </semantic.Container>
    </div>
  )
}

module.exports = BomBuilder
