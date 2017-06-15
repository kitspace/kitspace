const React = require('react')
const semantic = require('semantic-ui-react')

function InstallPrompt(props) {
    return (
      <semantic.Table.Cell warning colSpan={props.colSpan}>
        <semantic.Icon name='attention' />
        Please <a onClick={props.bomInstallLink}>install the 1-click BOM
          extension</a> to make full use of this feature.
      </semantic.Table.Cell>
    )
}

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

module.exports = InstallPrompt
