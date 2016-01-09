const React    = require('react');
const ReactDOM = require('react-dom');
const boards   = require('./boards.json');
const LazyLoad = require('./LazyLoad');
const Image    = require('./Image');

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


module.exports = BoardThumb;
