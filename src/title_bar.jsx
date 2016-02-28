const React       = require('react');
const ReactDOM    = require('react-dom');

const style = {
  submit: {
    height:'100%',
    lineHeight: '64px',
    verticalAlign:'middle',
    textAlign: 'center',
    backgroundColor: '#373737',
    paddingLeft: 10,
    paddingRight: 10,
    width: 140,
    color:'white'
  },

}

var TitleBar = React.createClass({

  render: function () {
    return (
      <div className='titleBar'>
        <div className='logoContainer'>
          <a href='/'>
            <center>
              <img style={{width:'70%'}} src='/images/logo.svg' />
            </center>
          </a>
        </div>
        <div className='middleContainer'>
          {this.props.children}
        </div>
        <a href='https://github.com/monostable/kitnic/#submitting-your-project-repo'>
          <div style={style.submit}>
           Submit
          </div>
        </a>
      </div>
    );
  }
});

module.exports = TitleBar;
