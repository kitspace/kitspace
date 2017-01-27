const React = require('react')

var TitleBar = React.createClass({
  propTypes: {
    children: React.PropTypes.any
  },
  render: function () {
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
          <a
          className='uploadContainer'
          href='https://github.com/monostable/kitnic/#submitting-your-project'>
            <div className='submissionButton'>
              <span>Register a project</span>
            </div>
          </a>
          <a
          className='contributeContainer'
          title='Contribute to Kitnic'
          href='https://github.com/monostable/kitnic/'>
            <div className='contributeButton'>
              <span className='octicon octicon-mark-github githubIcon'></span>
            </div>
          </a>
        </div>
      </div>
    )
  }
})

module.exports = TitleBar
