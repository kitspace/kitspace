'use strict'
const React = require('react')

const installExtension = require('../install_extension')

const style = {
  introContainer: {
    marginLeft: '10%',
    marginRight: '10%',
    marginTop: 32,
    marginBottom: 32
  },
  intro: {
    backgroundColor: '#FAFAFA',
    padding: 20,
    borderRadius: 5,
    textAlign: 'left',
    maxWidth: 700
  }
}

function Intro(props) {
  return (
    <center>
      <div style={style.introContainer}>
        <div className="introText" style={style.intro}>
          Chat | Twitter | GitHub
        </div>
      </div>
    </center>
  )
}

module.exports = Intro
