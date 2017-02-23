const React    = require('react')
const {h}      = require('react-hyperscript-helpers')
const semantic = require('semantic-ui-react')


function MpnPopup(props) {
    return (<semantic.Popup trigger={props.trigger} position='bottom left' content='reaaaaaaaaaaaaaaaally long text and stuff, you could have an image here' />)
}

module.exports = MpnPopup
