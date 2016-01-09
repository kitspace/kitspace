const React       = require('react');
const ReactDOM    = require('react-dom');
const SearchInput = require('react-search-input');

var TitleBar = React.createClass({
  render: function () {
    return (
      <div style={
        { backgroundColor:'#373737'
        , width:'100%', height:'64px'
        , boxShadow: '0px 0.1em 0.5em #000'
        , overflow: 'hidden'
        , borderBottomRightRadius: 5
        , borderBottomLeftRadius: 5
        }
      }>
        <div style={{
            padding: '10 10 10 10'
          , float:'left'
          , backgroundColor:'#373737'
          , width: 140
        }}>
          <a href='/'>
            <img src='/images/logo.png' />
          </a>
        </div>
        <a href='/submit'
          style={{
            color:'white'
          }}
        >
          <div style={{
            height:'100%'
            , lineHeight: '64px'
            , verticalAlign:'middle'
            , backgroundColor: '#373737'
            , float: 'right'
            , paddingLeft: 10
            , paddingRight: 10
            , width: 140
          }}>
          <center>
              Submit
          </center>
          </div>
        </a>
        <div style={{
          paddingTop: 2
          , overflow: 'hidden'
        }}>
          <SearchInput className='search-input'
            ref={function (ref) {this.search = ref}.bind(this)}
            onChange={this.props.searchCallback}
          />
        </div>
      </div>
    );
  }
});

module.exports = TitleBar;
