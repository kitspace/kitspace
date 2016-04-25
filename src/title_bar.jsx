const React       = require('react');
const ReactDOM    = require('react-dom');

var TitleBar = React.createClass({
  render: function () {
    return (
      <div className='titleBar'>
        <div className='logoContainer'>
          <a href='/'>
            <center>
              <img className='logoImg' src='/images/logo.svg' />
            </center>
          </a>
        </div>
        <div className='middleContainer'>
          {this.props.children}
        </div>
        <div className='submitContainer'>
          <a href='https://github.com/monostable/kitnic/#submitting-your-project'>
            <center>
              <img className='submitImage' src='/images/submit.svg' />
            </center>
          </a>
        </div>
      </div>
    );
  }
});

module.exports = TitleBar;
