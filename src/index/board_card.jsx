'use strict'
const React      = require('react')
const ReactResponsive = require('react-responsive');

const LazyLoad     = require('../lazy_load')
const FadeImage    = require('../fade_image')
const mediaQueries = require('../media_queries')

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
            <ReactResponsive query={mediaQueries.mobile}>
              {(matches) => {
                if (matches) {
                  return <FadeImage
                    src={'boards/' + this.props.data.id + '/images/top-large.png'}
                    className='img' />
                }
                else  {
                  return <FadeImage
                    src={'boards/' + this.props.data.id + '/images/top.png'}
                    className='img' />
                }
              }}
            </ReactResponsive>
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

function reverse(s){
  return s.split('').reverse().join('')
}


module.exports = BoardCard
