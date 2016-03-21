const React    = require('react');
const ReactDOM = require('react-dom');
const boards   = require('./boards.json');
const LazyLoad = require('./lazy_load');
const FadeImage    = require('./fade_image');

const sizes = {
  thumb : {
    w            : 240,
    h            : 180,
    captionH     : 40,
    descriptionH : 96
  }
}

const style =  {
  container: {
    width           : sizes.thumb.w + 32 + 16,
    height          :
      sizes.thumb.h + sizes.thumb.captionH
        + sizes.thumb.descriptionH + 16 + 5 + 16 + 5,
    borderRadius    : 4,
    marginTop       : 8,
    marginRight     : 8,
    marginBottom    : 8,
    marginLeft      : 8,
    display         : 'inline-block',
    border          : '1px solid #CFCFCF',
    cursor          : 'pointer',
    overflow        : 'hidden',
  },
  imgContainer: {
    backgroundColor : '#373737',
  },
  img: {
    width        : sizes.thumb.w,
    height       : sizes.thumb.h,
    marginTop    : 16,
    marginBottom : 16,
  },
  title: {
    height          : sizes.thumb.captionH,
    lineHeight      : String(sizes.thumb.captionH) + 'px',
    textAlign       : 'center',
    verticalAlign   : 'bottom',
    fontWeight      : 'bold',
    fontSize        : 18,
    opacity         : 1.0,
    backgroundColor : '#FAFAFA',
    color           : '#373737',
    textAlign       : 'left',
    paddingLeft     : 10,
  },
  url: {
    fontSize        : 13,
    backgroundColor : '#FAFAFA',
    color           : 'grey',
    opacity         : 1.0,
    fontWeight      : 'normal',
    paddingLeft     : 10,
    textAlign: 'left',
  },
  description: {
    visibility      : 'visible',
    height          : sizes.thumb.descriptionH,
    overflow        : 'hidden',
    padding         : '8 10 5 10',
    verticalAlign   : 'top',
    fontSize        : 16,
    marginBottom    : 10,
    opacity         : 1.0,
    backgroundColor : '#FAFAFA',
    color           : '#373737',
    fontWeight      : 'normal',
    textAlign: 'left',
  }
}

function reverse(s){
    return s.split("").reverse().join("");
}

function truncate(input, len, fromStart) {
    var str = input;
    if (fromStart) {
      str = reverse(str);
    }
    if (str.length > len) {
      str = str.substr(0,len);
      if (str[len] !== ' ') {
        str = str.concat(' ');
      }
      str = str.concat('...');
    }
    if (fromStart) {
      str = reverse(str);
    }
    return str;
}


var BoardThumb = React.createClass({
  render: function () {

    if (this.props.lazyLoad) {
      var image =
          <LazyLoad once={true}
            component={React.createElement('div', {style:style.img})} distance={300}>
            <FadeImage src={'boards/' + this.props.data.id + '/images/top.svg'}
              style = {style.img} />
          </LazyLoad>;
    } else {
      var image =
            <img src={'boards/' + this.props.data.id + '/images/top.svg'}
              style = {style.img} />;
    }

    return (
      <a href={'/boards/' + this.props.data.id}>
        <div
          style={style.container}
          className={'hover-shadow'}
        >
          <div style={style.imgContainer}>
          <center>
          {image}
          </center>
          </div>
          <div style={style.title}>
            {truncate(this.props.data.id.split('/').slice(2).join(' / '), 30, true)}
          </div>
          <div style={style.url}>
            {truncate(this.props.data.id.split('/').slice(0,2).join(' / '), 30, true)}
          </div>
          <div style={style.description}>
            {truncate(this.props.data.description, 87)}
          </div>
        </div>
      </a>
    );
  }
});


module.exports = BoardThumb;
