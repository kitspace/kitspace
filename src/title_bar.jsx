const React = require('react')

var TitleBar = React.createClass({
  propTypes: {
    children: React.PropTypes.any,
    submissionButton: React.PropTypes.bool,
  },
  render: function () {
    let button
    if (this.props.submissionButton) {
      button =
            (<a
            className='uploadContainer'
            href='/submit'>
              <div className='submissionButton'>
                <span>Register a project</span>
              </div>
            </a>);
    }
    else {
      button = null
    }
    return (
      <div className='titleBar'>
        <div className='logoContainer'>
          <a href='/'>
            <center className='logoImgContainer'>
              <img className='logoImg' src='/images/logo.svg' />
            </center>
          </a>
        </div>
        <div className='middleContainer'>
          {this.props.children}
        </div>
        <div className='submitContainer'>
          {button}
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
