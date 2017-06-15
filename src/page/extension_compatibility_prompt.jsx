const React = require('react')
const semantic = require('semantic-ui-react')

function ExtensionCompatibilityPrompt(props) {
    return (
      <semantic.Message warning>
        Sorry, the <a className='bomPromptLink'
        href='https://1clickbom.com/'>1-click BOM extension</a> is not yet
        available for your browser. Only the Digikey add-to-cart links work
          fully, Farnell and Newark should work but the references will not be
        added as line-notes.
      </semantic.Message>
    )
}

module.exports = ExtensionCompatibilityPrompt
