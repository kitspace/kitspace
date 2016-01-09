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


const sizes = {
  thumb : {
      w            : 240
    , h            : 180
    , captionH     : 48
    , descriptionH : 96
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
      , width: sizes.thumb.w + 32 + 16
      , height: sizes.thumb.h + sizes.thumb.captionH
          + sizes.thumb.descriptionH + 16 + 5 + 16
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
      width: sizes.thumb.w
      , height: sizes.thumb.h
      , marginTop: 16
      , marginBottom: 16
    };
    var titleStyle = {
      height: sizes.thumb.captionH
      , lineHeight: String(sizes.thumb.captionH) + 'px'
      , textAlign: 'center'
      , verticalAlign: 'middle'
      , fontWeight: 'bold'
      , fontSize: 18
      , paddingBottom: 5
      , opacity: 1.0
      , backgroundColor: '#FAFAFA'
      , color: '#373737'
    };
    var descrStyle = {
      visibility: 'visible'
      , height: sizes.thumb.descriptionH
      , overflow: 'hidden'
      , padding: '10 10 10 10'
      , textAlign: 'center'
      , verticalAlign: 'top'
      , fontSize: 16
      , marginBottom: 10
      , opacity: 1.0
      , backgroundColor: '#FAFAFA'
      , color : '#373737'
      , fontWeight: 'normal'
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
        <BoardThumb data={data} key={data.id}/>
      );
    });
    var displayIntro = this.props.data.length == boards.length ? 'inherit' : 'none';
    var intro = (
      <div style={{marginLeft:'10%', marginRight:'10%', marginTop:32, marginBottom: 32, display:displayIntro}}>
      <center>
        <div style={{backgroundColor: '#FAFAFA', padding: 20, borderRadius: 5,  textAlign:'left', maxWidth:700}}>
        <p>

          Kitnic.it is a repository of open hardware electronics projects that
          are ready for you to order and build. Click on a project to get further
          info, download the gerbers and see the bill of materials.

        </p><p>

          To quickly purchase the parts from various retailers you should
          <a href=''> install</a> the 1-click-BOM extension. It's pretty useful
          on it's own too and can be used on other sites. Read more about it
          <a href='http://1clickBOM.com'> here</a>.

        </p><p>

          <a href='/submit'> Submit</a> your own project to have it listed here!

        </p>
      </div>
      </center>
      </div>
    );
    return (
      <div>
          {intro}
        <div style={{margin: 32, textAlign:'center'}}>
          {thumbNodes}
        </div>
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

module.exports = Main;
