const React = require('react')
const semantic = require('semantic-ui-react')

function BomInstallPrompt(props) {
    return (
      <semantic.Table.Cell warning colSpan={props.colSpan}>
        <semantic.Icon name='attention' />
        Please <a onClick={props.bomInstallLink}>install the 1-click BOM
          extension</a> to make full use of this feature.
      </semantic.Table.Cell>
    )
}
module.exports = BomInstallPrompt
