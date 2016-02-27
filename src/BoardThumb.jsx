const React    = require('react');
const ReactDOM = require('react-dom');
const boards   = require('./boards.json');
const LazyLoad = require('./LazyLoad');
const FadeImage    = require('./FadeImage');

const sizes = {
  thumb : {
      w            : 240
    , h            : 180
    , captionH     : 48
    , descriptionH : 96
  }
}

const style =  {
    container: {
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
    },
    img: {
      width: sizes.thumb.w
      , height: sizes.thumb.h
      , marginTop: 16
      , marginBottom: 16
    },
    title: {
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
    },
    description: {
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
    }
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
          <center>
          {image}
          </center>
          <div style={style.title}>
            {this.props.data.id.split('/').slice(1).join(' / ')}
          </div>
          <div style={style.description}>
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


module.exports = BoardThumb;
