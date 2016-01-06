// main.js
var testData    = require('./boards.json');
var LazyLoad    = require('./LazyLoad');
var React       = require('react');
var ReactDOM    = require('react-dom');
var SearchInput = require('react-search-input');
var Image       = require('./image');

var TitleBar = React.createClass({
  render: function () {
    return (
      <div style={
        { backgroundColor:'rgb(55,55,55)'
        , width:'100%', height:'64px'
        , boxShadow: '0px 0.1em 0.5em #000'
        }
      }>
      <div style={{padding: '10 10 10 10'}}>
        <a href='/'>
          <img src='/images/logo.png' />
        </a>
      </div>
      </div>
    );
  }
});


const dim = {
  thumb : {
      w    : 300
    , h    : 225
    , capH : 48
    , descrH : 96
  }
}

var BoardThumb = React.createClass({
  getInitialState: function() {
    return {hover: false};
  },
  handleMouseOver: function (e) {
    this.setState({hover: true});
  },
  handleMouseOut: function (e) {
    this.setState({hover: false});
  },
  handleClick: function (e) {
      document.location.href += 'boards/' + this.props.data.id;
  },
  render: function () {
    var style = {
      backgroundColor: '#FAFAFA'
      , width: (dim.thumb.w * 0.8) + 32 + 16
      , height: (dim.thumb.h * 0.8) + dim.thumb.capH +  dim.thumb.descrH + 16 + 5
      , borderRadius: 10
      , color: 'rgb(55,55,55)'
      , marginTop:  8
      , marginRight: 8
      , marginBottom: 8
      , marginLeft: 8
      , display: 'inline-block'
      , border: '1px solid #CFCFCF'
      , cursor: 'pointer'
      , overflow: 'hidden'
    };
    var imgStyle = {
      width: dim.thumb.w * 0.8
      , height: dim.thumb.h * 0.8
      , marginTop: 16
    };
    var titleStyle = {
      height: dim.thumb.capH
      , textAlign: 'center'
      , verticalAlign: 'middle'
      , lineHeight: String(dim.thumb.capH) + 'px'
      , fontFamily: 'helvetica, sans'
      , fontWeight: 'bold'
      , fontSize: 18
      , paddingBottom: 5
      , opacity: 1.0
    };
    var descrStyle = {
      visibility: 'visible'
      , height: dim.thumb.descrH
      , overflow: 'hidden'
      , padding: '10 10 10 10'
      , fontFamily: 'helvetica, sans'
      , textAlign: 'center'
      , verticalAlign: 'top'
      , backgroundColor: '#F0F0F0'
      , fontSize: 16
      , marginBottom: 10
      , opacity: 1.0
    };

    var image =
        <LazyLoad once={true} component={React.createElement('div', {style:imgStyle})} distance={300}>
          <Image src={'boards/' + this.props.data.id + '/images/thumb.png'}
            style = {imgStyle} />
        </LazyLoad>;

    return (
      <div
        onClick={this.handleClick}
        style={style}
        className={'hover-shadow'}
      >
        <center>
        {image}
        </center>
        <div style={titleStyle}>
          {this.props.data.id.split('/').slice(1).join(' / ')}
        </div>
        <div style={descrStyle}>
          {(function() {
              var str = this.props.data.description;
              if (str.length > 87) {
                str = str.substr(0,87);
                if (str[87] !== ' ') {
                  str = str.concat(' ');
                }
                str = str.concat('...');
              }
              return str;
            }).call(this)
          }
        </div>
      </div>
    );
  }
});

var BoardList = React.createClass({
  render: function () {
    var thumbNodes = this.props.data.map(function(data) {
      return (
        <BoardThumb data={data} />
      );
    });
    return (
      <div style={{margin: 32, textAlign:'center'}}>
      {thumbNodes}
      </div>
    );
  }
});

var Main = React.createClass({
  render: function () {
    var data = testData;

    if (this.refs.search) {
      var filters = ['id', 'description'];
      data = data.filter(this.refs.search.filter(filters));
    }

    return (
      <div>
        <TitleBar />
        <SearchInput ref='search' onChange={this.searchUpdated} />
        <BoardList data={data} />
      </div>
    );
  },

  searchUpdated: function (term) {
    this.setState({searchTerm: term}); // needed to force re-render
  }
});

ReactDOM.render(
  <Main />,
  document.getElementById('content')
);
