const React = require('react')
const semantic = require('semantic-ui-react')

var TitleBar = React.createClass({
  propTypes: {
    children: React.PropTypes.any,
    submissionButton: React.PropTypes.bool,
  },
  render: function () {
    const menu = (
        <semantic.Sidebar
          as={semantic.Menu}
          animation='overlay'
          width='thin'
          direction='right'
          visible={true}
          icon='labeled'
          vertical
          inverted
        >
          <semantic.Menu.Item name='home'>
            <semantic.Icon name='home' />
            Home
          </semantic.Menu.Item>
          <semantic.Menu.Item name='gamepad'>
            <semantic.Icon name='gamepad' />
            Games
          </semantic.Menu.Item>
          <semantic.Menu.Item name='camera'>
            <semantic.Icon name='camera' />
            Channels
          </semantic.Menu.Item>
        </semantic.Sidebar>
    )
    return (
      <div className='titleBar'>
        <div className='logoContainer'>
          <a href='/'>
            <img className='logoImg' src='/images/logo.svg' />
          </a>
        </div>
        <div className='middleContainer'>
          {this.props.children}
        </div>
        <div className='submitContainer'>
          {menu}
        </div>
      </div>
    )
  }
})

module.exports = TitleBar
