const React       = require('react');
const ReactDOM    = require('react-dom');

const style = {
  titleBar: {
    backgroundColor:'#373737',
    width:'100%',
    boxShadow: '0px 0.1em 0.5em #000',
    overflow: 'hidden',
    borderBottomRightRadius: 5,
    borderBottomLeftRadius: 5,
    display:'flex',
    flexWrap: 'wrap',
  },

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
      <div style={style.titleBar}>
        <div className='logoContainer'>
          <a href='/'>
            <img style={{width:'90%'}} src='/images/logo.svg' />
          </a>
        </div>
        <div className='title_bar middleContainer'>
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
