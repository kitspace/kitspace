'use strict'
const React            = require('react')
const BoardCard        = require('./board_card')
const InstallExtension = require('../install_extension')

const style = {
  introContainer: function (show) {
    return {
      marginLeft:'10%',
      marginRight:'10%',
      marginTop: 32,
      marginBottom: 32,
      display:(show ? 'inherit' : 'none')
    }
  },
  intro: {
    backgroundColor: '#FAFAFA',
    padding: 20,
    borderRadius: 5,
    textAlign:'left',
    maxWidth:700
  }
}
var BoardList = React.createClass({
  propTypes: {
    data: React.PropTypes.array,
    searching: React.PropTypes.bool
  },
  render: function () {
    let onClick = InstallExtension
    var initialLoad = !(this.props.searching)
    if (this.props.data.length === 0) {
      return (
        <div>
          <div style={{height:'40%'}}></div>
          <div style={{width:'100%', textAlign:'center'}}>
                No results
          </div>
        </div>
      )
    }
    var cardNodes = this.props.data.map(function(data, index) {
      return (
        <BoardCard data={data} key={data.id + index}
          lazyLoad={true}/>
      )
    })
    var intro = (
      <center>
      <div style={style.introContainer(initialLoad)}>
        <div className='introText' style={style.intro}>
          <p>

            Kitnic is a registry of open hardware electronics projects that are
            ready for you to order and build. Click on any project to get
            further info, download the Gerbers and see the bill of materials.


          </p><p>

            To quickly purchase the parts from various retailers you should <a
            className='clickableLink' onClick={onClick}>install</a> the 1-click
            BOM extension. It's pretty useful on it's own too and can be used
            on other sites. Read more about it <a className='clickableLink'
            href='http://1clickBOM.com' >here</a>.

          </p><p>


          Help build an open hardware repository of useful electronics
          projects! <a
          href='https://github.com/monostable/kitnic/#submitting-your-project'>
          Submit</a> your own project to have it listed here. Follow Kitnic
          on <a
          href='https://twitter.com/kitnic_it'>Twitter</a>, <a
          href='https://www.facebook.com/kitnicit'>Facebook</a>, <a
          href='https://reddit.com/r/kitnic'>Reddit</a>, <a
          href='https://hackaday.io/project/11871-kitnic'>Hackaday.io</a> or <a
          href='https://github.com/monostable/kitnic'>GitHub</a> to get
          updates as we progress and add content.

          </p><p>

            <i>

            We are giving away free PCB manufacturing vouchers with <a
            href='http://dangerousprototypes.com/store/pcbs'>Dangerous
            Prototypes</a> for the first 20 projects that register. Current
            status: 8/20 left.

            </i>

          </p>

        </div>
      </div>
      </center>
    )
    return (
      <div>
          {intro}
        <div className='boardList'>
          {cardNodes}
        </div>
      </div>
    )
  }
})

module.exports = BoardList
