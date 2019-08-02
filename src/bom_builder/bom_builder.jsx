const React = require('react')
const ReactSearchInput = require('react-search-input')
const TitleBar = require('../title_bar')

function BomBuilder(props) {
  return (
    <div>
      <TitleBar route="/bom_builder" />
    </div>
  )
}
module.exports = BomBuilder
