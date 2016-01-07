// main.js
const boards      = require('./boards.json');
const LazyLoad    = require('./LazyLoad');
const React       = require('react');
const ReactDOM    = require('react-dom');
const SearchInput = require('react-search-input');
const Image       = require('./image');

var TitleBar = React.createClass({
  render: function () {
    return (
      <div style={
        { backgroundColor:'#373737'
        , width:'100%', height:'64px'
        , boxShadow: '0px 0.1em 0.5em #000'
        }
      }>
      <div style={{padding: '10 10 10 10'}}>
        <a href='/'>
          <img src='/images/logo.png' />
        </a>
      </div>
        <SearchInput ref={function (ref) {this.search = ref}.bind(this)} onChange={this.props.searchCallback} />
      </div>
    );
  }
});


const dim = {
  thumb : {
      w    : 240
    , h    : 180
    , capH : 48
    , descrH : 96
  }
}

var BoardThumb = React.createClass({

  getDefaultProps: function() {
    return ({
      data: {
        id : 'github.com/kitnic/arduino-uno' //so we have an image to get
        , description : ''
      }
    });
  },

  render: function () {
    var style = {
      backgroundColor: '#373737'
      , width: dim.thumb.w + 32 + 16
      , height: dim.thumb.h + dim.thumb.capH +  dim.thumb.descrH + 16 + 5 + 16
      , borderRadius: 10
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
      width: dim.thumb.w
      , height: dim.thumb.h
      , marginTop: 16
      , marginBottom: 16
    };
    var titleStyle = {
      height: dim.thumb.capH
      , textAlign: 'center'
      , verticalAlign: 'middle'
      , lineHeight: String(dim.thumb.capH) + 'px'
      , fontWeight: 'bold'
      , fontSize: 18
      , paddingBottom: 5
      , opacity: 1.0
      , backgroundColor: '#FAFAFA'
      , color: '#373737'
    };
    var descrStyle = {
      visibility: 'visible'
      , height: dim.thumb.descrH
      , overflow: 'hidden'
      , padding: '10 10 10 10'
      , textAlign: 'center'
      , verticalAlign: 'top'
      , fontSize: 16
      , marginBottom: 10
      , opacity: 1.0
      , backgroundColor: '#FAFAFA'
      , color : '#373737'
    };

    var image =
        <LazyLoad once={true}
          component={React.createElement('div', {style:imgStyle})} distance={300}>
          <Image src={'boards/' + this.props.data.id + '/images/top.svg'}
            style = {imgStyle} />
        </LazyLoad>;

    return (
      <a href={'/boards/' + this.props.data.id}>
        <div
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
      </a>
    );
  }
});

var BoardList = React.createClass({
  render: function () {
    if (this.props.data.length === 0) {
      return (
        <div>
          <div style={{height:'40%'}}></div>
          <div style={{width:'100%', textAlign:'center'}}>
                No results
          </div>
        </div>
      );
    }
    var thumbNodes = this.props.data.map(function(data, index) {
      return (
        <BoardThumb data={data} key={'thumb-' + index}/>
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
  getInitialState: function() {
    return {result: boards};
  },
  render: function () {
    return (
      <div>
        <TitleBar ref='title' searchCallback={this.searchUpdated} />
        <BoardList data={this.state.result} />
      </div>
    );
  },

  searchUpdated: function (term) {
    if (this.refs.title.search) {
      var filters = ['id', 'description'];
      var result = boards.filter(this.refs.title.search.filter(filters));
      this.setState({result: result});
    }
  }
});

ReactDOM.render(
  <Main />,
  document.getElementById('content')
);
