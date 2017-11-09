import * as React from 'react'
import * as semantic from 'semantic-ui-react'
import * as  superagent from 'superagent'

function getSignOutToken() {
  return superagent.get('/accounts/profile')
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
    const auth = document.querySelector('#signOutToken')
    auth.value = token
    const form = auth.parentElement
    form.submit()
  })
}


function UserMenu(props) {
  const user = props.user
  return (
    <div className='UserMenu'>
      <form style={{display: 'none'}} method='post' action='/accounts/users/sign_out'>
        <input type='hidden' name='_method' value='delete' />
        <input type='hidden' name='authenticity_token' id='signOutToken'/>
      </form>
      <div className='userName'>{user.get('username')}</div>
      <semantic.Menu vertical attached>
        <semantic.Menu.Item href='/'>
          <semantic.Icon name='grid layout' />
          Your projects
        </semantic.Menu.Item>
        <semantic.Menu.Item href='/settings'>
          <semantic.Icon name='settings' />
          Settings
        </semantic.Menu.Item>
        <semantic.Menu.Item onClick={signOut}>
          <semantic.Icon name='sign out' />
          Sign out
        </semantic.Menu.Item>
      </semantic.Menu>
    </div>
  )
}

export default UserMenu
