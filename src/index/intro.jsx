'use strict'
const React = require('react')

const installExtension = require('../install_extension')

const style = {
  introContainer: {
    marginLeft   : '10%',
    marginRight  : '10%',
    marginTop    : 32,
    marginBottom : 32,
  },
  intro: {
    backgroundColor : '#FAFAFA',
    padding         : 20,
    borderRadius    : 5,
    textAlign       : 'left',
    maxWidth        : 700
  }
}

function Intro(props) {
  return (
    <center>
      <div style={style.introContainer}>
        <div className='introText' style={style.intro}>
          <p>

            Kitspace (formerly called Kitnic) is a registry of open hardware
            electronics projects that are ready for you to order and build.
            Click on any project to get further info, download the Gerbers and
            see the bill of materials.


          </p><p>

            To quickly purchase the parts from various retailers you should <a
            className='clickableLink' onClick={installExtension}>install</a> the 1-click
            BOM extension. It's pretty useful on it's own too and can be used
            on other sites. Read more about it <a className='clickableLink'
            href='http://1clickBOM.com' >here</a>.

          </p><p>


          Help make Kit Space an open hardware repository of useful electronics
          projects! <a
          href='/submit'>
          Submit</a> your own project to have it listed here. Follow Kitnic
          on <a
          href='https://twitter.com/kitspaceorg'>Twitter</a>, <a
          href='https://www.facebook.com/kitnicit'>Facebook</a>, <a
          href='https://reddit.com/r/kitspace'>Reddit</a>, <a
          href='https://hackaday.io/project/11871-kitspace'>Hackaday.io</a> or <a
          href='https://github.com/monostable/kitspace'>GitHub</a> to get
          updates as we progress and add content.

          </p>

        </div>
      </div>
    </center>
  )
}

module.exports = Intro
