'use strict'
const React     = require('react')
const LazyLoad  = require('../lazy_load')
const FadeImage = require('../fade_image')

function reverse(s){
  return s.split('').reverse().join('')
}

function truncate(input, len, fromStart) {
  var str = input
  if (fromStart) {
    str = reverse(str)
  }
  if (str.length > len) {
    str = str.substr(0,len)
    if (str[len] !== ' ') {
      str = str.concat(' ')
    }
    str = str.concat('...')
  }
  if (fromStart) {
    str = reverse(str)
  }
  return str
}
let BoardCard = React.createClass({
  propTypes: {
    lazyLoad: React.PropTypes.bool,
    data: React.PropTypes.object
  },
  render: function () {
    var image
    if (this.props.lazyLoad) {
      image =
          <LazyLoad once={true}
            component={React.createElement('div', {className:'img'})}
            distance={300}>
            <FadeImage src={'boards/' + this.props.data.id + '/images/top.png'}
              className='img' />
          </LazyLoad>
    } else {
      image =
          <img src={'boards/' + this.props.data.id + '/images/top.svg'}
             className = 'img' />
    }
    return (
      <div className='boardCard'>
        <a href={'/boards/' + this.props.data.id}>
            <div className='imgContainer'>
                { image }
            </div>
            <div className='title'>
              {truncate(this.props.data.id.split('/').slice(2).join(' / '),
               30, true)}
            </div>
            <div className='url'>
              {truncate(this.props.data.id.split('/').slice(0,2).join(' / '),
               30, true)}
            </div>
            <div className='summary'>
              {truncate(this.props.data.summary, 85)}
            </div>
        </a>
      </div>
    )
  }
})

module.exports = BoardCard
