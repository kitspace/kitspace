const React    = require('react');
const ReactDOM = require('react-dom');
const boards   = require('./boards.json');
const LazyLoad = require('./lazy_load');
const FadeImage    = require('./fade_image');


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
            component={React.createElement('div', {className:'img'})} distance={300}>
            <FadeImage src={'boards/' + this.props.data.id + '/images/top.svg'}
              className='img' />
          </LazyLoad>;
    } else {
      var image =
            <img src={'boards/' + this.props.data.id + '/images/top.svg'}
             className = 'img' />;
    }

    return (
      <div className='BoardThumb'>
      <a href={'/boards/' + this.props.data.id}>
          <div className='imgContainer'>
            <center>
              {image}
            </center>
          </div>
          <div className='title'>
            {truncate(this.props.data.id.split('/').slice(2).join(' / '), 30, true)}
          </div>
          <div className='url'>
            {truncate(this.props.data.id.split('/').slice(0,2).join(' / '), 30, true)}
          </div>
          <div className='description'>
            {truncate(this.props.data.description, 87)}
          </div>
      </a>
      </div>
    );
  }
});


module.exports = BoardThumb;
