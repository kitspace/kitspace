// main.js
var testData = require('./boards.json');
var Image = require('./image');
var LazyLoad = require('react-lazyload');
var React = require('react');
var ReactDOM = require('react-dom');
var SearchInput = require('react-search-input');

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
          <Image src='/images/logo.png' />
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
      backgroundColor: '#DFDFDF'
      , width: (dim.thumb.w * 0.8) + 32 + 16
      , height: (dim.thumb.h * 0.8) + dim.thumb.capH + 16 + 5
      , borderRadius: 10
      , color: 'rgb(55,55,55)'
      , marginTop:  8
      , marginRight: 8
      , marginBottom: 8
      , marginLeft: 8
      , display: 'inline-block'
      , border: '1px solid #CFCFCF'
      , cursor: 'pointer'
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
      , fontSize: 16
      , paddingBottom: 5
      , opacity: 1.0
    };
    var descrStyle = {
      visibility: 'hidden'
      , height: 40
      , overflow: 'hidden'
      , padding: '10 10 10 10'
      , fontFamily: 'helvetica, sans'
      , textAlign: 'center'
      , marginBottom: 10
      , opacity: 1.0
    };

    var image =
        <LazyLoad>
          <img src={'boards/' + this.props.data.id + '/images/thumb.png'}
            style = {imgStyle} />
        </LazyLoad>;

    if (this.state.hover) {
      style.backgroundColor  = '#F0F0F0';
      //a lot of the calcs don't make sense
      //this is what works to keep the others from moving
      style.height          += (dim.thumb.h * 0.2) + 80;
      style.width           += (dim.thumb.w * 0.2);
      style.marginBottom    -= (dim.thumb.h * 0.2) + 60;
      style.marginTop       -= 50;
      style.marginLeft      -= (dim.thumb.h * 0.177);
      style.marginRight     -= (dim.thumb.h * 0.177);
      style.opacity          = 0.93;
      imgStyle.opacity       = 1.0;
      imgStyle.width         = dim.thumb.w;
      imgStyle.height        = dim.thumb.h;
      titleStyle.height     -= 24;
      imgStyle.padding       = '26px 27px 0px 27px';
      style.width           += 20;
      style.position         = 'relative';
      descrStyle.visibility  = 'visible';
      style.boxShadow        = '0px 0.1em 0.5em #000';
      image =
          <img src={'boards/' + this.props.data.id + '/images/thumb.png'}
            style = {imgStyle} />;
    }


    return (
      <div
        onMouseOver={this.handleMouseOver}
        onMouseOut={this.handleMouseOut}
        onClick={this.handleClick}
        style={style}
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
