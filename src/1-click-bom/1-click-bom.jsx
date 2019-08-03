const React = require('react')
const Markdown = require('react-markdown')
const semantic = require('semantic-ui-react')
const ReactSearchInput = require('react-search-input')
const TitleBar = require('../title_bar')

const text = `
<p align=center>
<a href="https://chrome.google.com/webstore/detail/1clickbom/mflpmlediakefinapghmabapjeippfdi">
<img src="https://raw.githubusercontent.com/kitspace/1clickBOM/master/readme_images/chrome.png" />
</a>
<a href="https://addons.mozilla.org/firefox/downloads/latest/634060/addon-634060-latest.xpi">
<img src="https://raw.githubusercontent.com/kitspace/1clickBOM/master/readme_images/firefox.png" />
</a>
</p>

1-click BOM is a browser extension that fills your shopping carts for you on sites like Digikey and Mouser. It lets you simply click on the "buy parts" links on Kitspace to get the right parts. You can also use it directly with your own spreadsheets or with our [BOM Builder](/bom-builder) tool.

[Read further documentation on GitHub](https://github.com/kitspace/1clickBOM#readme).

<p align=center>
<img src="https://raw.githubusercontent.com/kitspace/1clickBOM/master/readme_images/demo.gif" />
</p>

`

function BomBuilder(props) {
  return (
    <div>
      <TitleBar route="/1-click-bom/" />
      <semantic.Container style={{marginTop: 30}}>
        <Markdown source={text} />
      </semantic.Container>
    </div>
  )
}

module.exports = BomBuilder
