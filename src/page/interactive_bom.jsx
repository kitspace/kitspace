const React = require('react')
const semantic = require('semantic-ui-react')
const ReactResponsive = require('react-responsive')

const {folder} = require('../zip-info.json')
const ibomUrl = `https://kitspace.org/${folder}/interactive_bom.html`

function InteractiveBOM() {
  return (
    <ReactResponsive
      query={
        '(max-width: 920px)' // XXX if you change this change it in the .scss too!
      }
    >
      {matches => (
        <div className="InteractiveBOMMenu">
          <semantic.Menu stackable={matches} compact borderless>
            <div className="InteractiveBOMMenu__container">
              <div className="InteractiveBOMMenu__link">
                <semantic.Menu.Item as="a" href="interactive_bom.html">
                  <semantic.Icon size="big" name="columns" />
                  Interactive BOM
                </semantic.Menu.Item>
              </div>
            </div>
          </semantic.Menu>
        </div>
      )}
    </ReactResponsive>
  )
}

module.exports = InteractiveBOM
