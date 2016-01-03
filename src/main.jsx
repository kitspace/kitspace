// main.js
const React = require('react');
const ReactDOM = require('react-dom');
const testData = require('./boards.json');

var TitleBar = React.createClass({
  render: function () {
    return (
      <div style={
        { backgroundColor:'rgb(55,55,55)'
        , width:'100%', height:'64px'
        , boxShadow: '0px 0.1em 0.5em #000'
        }
      }>
        <img src='images/logo.png' style={{padding: '10 10 10 10'}}/>
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
      backgroundColor: '#CFCFCF'
      , width: (dim.thumb.w * 0.8) + 32 + 16
      , height: (dim.thumb.h * 0.8) + dim.thumb.capH + 16 + 5
      , borderRadius: 5
      , color: 'rgb(55,55,55)'
      , marginTop:  16
      , marginRight: 0
      , marginBottom: 0
      , marginLeft: 16
      , float: 'left'
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

    if (this.state.hover) {
      style.backgroundColor = '#F0F0F0';
      style.height += (dim.thumb.h * 0.2) + 80;
      style.width += (dim.thumb.w * 0.2);
      style.marginBottom -= (dim.thumb.h * 0.2) + 60;
      style.marginTop -= 20;
      style.marginLeft -= (dim.thumb.h * 0.2);
      style.marginRight -= (dim.thumb.h * 0.2);
      style.opacity = 0.93;
      imgStyle.opacity = 1.0;
      imgStyle.width = dim.thumb.w;
      imgStyle.height = dim.thumb.h;
      titleStyle.height -= 24;
      imgStyle.padding = '26px 27px 0px 27px';
      style.width += 20;
      style.position = 'relative';
      style.zIndex = '500 !important';
      descrStyle.visibility =  'visible';
      style.boxShadow =  '0px 0.1em 0.5em #000';
    }

    return (
      <div
        onMouseOver={this.handleMouseOver}
        onMouseOut={this.handleMouseOut}
        onClick={this.handleClick}
        style={style}
      >
        <center>
          <img src={'boards/' + this.props.data.id + '/images/thumb.png'}
            style = {imgStyle} />
        </center>
        <div style={titleStyle}>
          {this.props.data.id.split('/').slice(1).join(' / ')}
        </div>
        <div style={descrStyle}>
          {this.props.data.description}
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
      <div style={{padding: 32}}>
      {thumbNodes}
      </div>
    );
  }
});

var Main = React.createClass({
  render: function() {
    return (
      <div>
      <TitleBar />
      <BoardList data={testData} />
    </div>
    );
  }
});

ReactDOM.render(
  <Main />,
  document.getElementById('content')
);
