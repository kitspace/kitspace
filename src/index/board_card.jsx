const React = require('react')
const ReactResponsive = require('react-responsive')
const createClass = require('create-react-class')

const LazyLoad = require('../lazy_load')
const FadeImage = require('../fade_image')
const mediaQueries = require('../media_queries')

function truncate(input, len, fromStart) {
  let str = input
  if (fromStart) {
    str = reverse(str)
  }
  if (str.length > len) {
    str = str.substr(0, len) + '...'
  }
  if (fromStart) {
    str = reverse(str)
  }
  return str
}

const BoardCard = createClass({
  render: function() {
    const id = this.props.data.id
    const path = id.toLowerCase()
    let image
    if (this.props.lazyLoad) {
      image = (
        <LazyLoad
          once={true}
          component={React.createElement('div', {className: 'img'})}
          distance={300}
        >
          <ReactResponsive query={mediaQueries.mobile}>
            {matches => {
              if (matches) {
                return (
                  <FadeImage
                    src={'boards/' + path + '/images/top-large.png'}
                    className="img"
                  />
                )
              } else {
                return (
                  <FadeImage
                    src={'boards/' + path + '/images/top.png'}
                    className="img"
                  />
                )
              }
            }}
          </ReactResponsive>
        </LazyLoad>
      )
    } else {
      image = <img src={'boards/' + path + '/images/top.svg'} className="img" />
    }
    return (
      <div className="boardCard">
        <a href={'/boards/' + path + '/'}>
          <div className="imgContainer">{image}</div>
          <div className="title">
            {id
              .split('/')
              .slice(-1)
              .join(' / ')}
          </div>
          <div className="url">
            {id
              .split('/')
              .slice(0, 2)
              .join(' / ')}
          </div>
          <div className="summary">{truncate(this.props.data.summary, 85)}</div>
        </a>
      </div>
    )
  }
})

function reverse(s) {
  return s
    .split('')
    .reverse()
    .join('')
}

module.exports = BoardCard
