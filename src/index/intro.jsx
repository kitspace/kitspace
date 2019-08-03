'use strict'
const React = require('react')

const style = {
  introContainer: {
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
          Kitspace is a place to share ready-to-order electronics designs. We automate parts purchasing to let you focus on building.
        </div>
      </div>
    </center>
  )
}

module.exports = Intro
