// main.js
var React = require('react');
var ReactDOM = require('react-dom');

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

const dim = {topBar : {h : 64}, thumb : {w : 300, h : 225, capH : 48}}

var BoardThumb = React.createClass({
  render: function () {
    return (
      <div style={
        { backgroundColor:'#F0F0F0'
        , width: dim.thumb.w + 32
        , height: dim.thumb.h + dim.thumb.capH + 16 + 5
        , borderRadius: 5
        , fontFamily: 'helvetica, sans'
        , fontWeight: 'bold'
        , fontSize: 16
        , color: 'rgb(55,55,55)'
        }
      }>
      <div>
        <img src={'boards/' + this.props.data.id + '/images/thumb.png'}
          style = {{
            padding: '16px 16px 0px 16px'
          }}
        />
      </div>
      <div style={
        { height: dim.thumb.capH
        , textAlign: 'center'
        , verticalAlign: 'middle'
        , lineHeight: String(dim.thumb.capH) + 'px'
        , paddingBottom: 5
        }
      }>
        {this.props.data.id.split('/').slice(1).join(' / ')}
      </div>
      </div>
    );
  }
});

testData = {id: 'github.com/kitnic/arduino-uno'};

var Main = React.createClass({
  render: function() {
    return (
      <div>
      <TitleBar />
      <BoardThumb data={testData} />
    </div>
    );
  }
});

ReactDOM.render(
  <Main />,
  document.getElementById('content')
);
