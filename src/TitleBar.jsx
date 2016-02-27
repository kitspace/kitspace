const React       = require('react');
const ReactDOM    = require('react-dom');

var TitleBar = React.createClass({
  titleBarStyle: {
    backgroundColor:'#373737',
    width:'100%', height:'64px',
    boxShadow: '0px 0.1em 0.5em #000',
    overflow: 'hidden',
    borderBottomRightRadius: 5,
    borderBottomLeftRadius: 5
  },

  logoContainerStyle: {
    padding: '10 10 10 10',
    float:'left',
    backgroundColor:'#373737',
    width: 140
  },

  submitStyle: {
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

  middleContainerStyle: {
    paddingTop: 2,
    overflow: 'hidden'
  },

  render: function () {
    return (
      <div style={this.titleBarStyle}>
        <div style={this.logoContainerStyle}>
          <a href='/'>
            <img src='/images/logo.png' />
          </a>
        </div>
        <a href='https://github.com/monostable/kitnic/#submitting-your-project-repo'>
          <div style={this.submitStyle}>
           Submit
          </div>
        </a>
        <div style={this.middleContainerStyle}>
          {this.props.children}
        </div>
      </div>
    );
  }
});

module.exports = TitleBar;
