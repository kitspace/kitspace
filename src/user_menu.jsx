const React      = require('react')
const semantic   = require('semantic-ui-react')
const superagent = require('superagent')

function getSignOutToken() {
  return superagent.get('/gitlab/profile')
    .withCredentials()
    .then(r => {
      return (new DOMParser).parseFromString(r.text, 'text/html')
    }).then(doc => {
      const input = doc.querySelector('input[name=authenticity_token]')
      if (input == null) {
        throw Error('Could not get token')
      }
      return input.value
    })
}

function signOut() {
  return getSignOutToken().then(token => {
    const auth = document.querySelector('input[name=authenticity_token]')
    auth.value = token
    const form = auth.parentElement
    form.submit()
  })
}


function UserMenu(props) {
  return (
    <semantic.Menu vertical>
      <form style={{display: 'none'}} method='post' action='/gitlab/users/sign_out'>
        <input  type='hidden'  name='_method' value='delete' />
        <input  type='hidden'  name='authenticity_token' />
      </form>
      <semantic.Menu.Item onClick={signOut}>Sign out</semantic.Menu.Item>
    </semantic.Menu>
  )
}

module.exports = UserMenu
