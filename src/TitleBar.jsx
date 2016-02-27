const React       = require('react');
const ReactDOM    = require('react-dom');

const style = {
  titleBar: {
    backgroundColor:'#373737',
    width:'100%', height:'64px',
    boxShadow: '0px 0.1em 0.5em #000',
    overflow: 'hidden',
    borderBottomRightRadius: 5,
    borderBottomLeftRadius: 5
  },

  logoContainer: {
    padding: '10 10 10 10',
    float:'left',
    backgroundColor:'#373737',
    width: 140
  },

  submit: {
    height:'100%',
    lineHeight: '64px',
    verticalAlign:'middle',
    textAlign: 'center',
    backgroundColor: '#373737',
    float: 'right',
    paddingLeft: 10,
    paddingRight: 10,
    width: 140,
    color:'white'
  },

  middleContainer: {
    paddingTop: 2,
    overflow: 'hidden'
  }
}

var TitleBar = React.createClass({

  render: function () {
    return (
      <div style={style.titleBar}>
        <div style={style.logoContainer}>
          <a href='/'>
            <img src='/images/logo.png' />
          </a>
        </div>
        <a href='https://github.com/monostable/kitnic/#submitting-your-project-repo'>
          <div style={style.submit}>
           Submit
          </div>
        </a>
        <div style={style.middleContainer}>
          {this.props.children}
        </div>
      </div>
    );
  }
});

module.exports = TitleBar;
