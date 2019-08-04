const React = require('react')
const ReactSearchInput = require('react-search-input')
const SearchInput = ReactSearchInput.default
const semantic = require('semantic-ui-react')

const BoardList = require('./board_list')
const Intro = require('./intro')

const TitleBar = require('../title_bar')
const boards = require('../boards.json')

function Search(props) {
  return (
    <semantic.Container
      style={{marginTop: 40, display: 'flex', justifyContent: 'center'}}
    >
      <div className="searchContainer">
        <div className="searchBackground">
          <div className="searchInputIcon">
            <span className="icon-search searchIcon" />
          </div>
          <SearchInput
            placeholder="Search for projects"
            className="searchInput"
            onChange={props.searchUpdated}
          />
        </div>
      </div>
    </semantic.Container>
  )
}

var Main = React.createClass({
  getInitialState() {
    return {
      result: boards,
      searching: false
    }
  },
  render() {
    return (
      <div>
        <TitleBar route="/" />
        <Search searchUpdated={this.searchUpdated} />
        {this.state.searching ? null : <Intro />}
        <BoardList data={this.state.result} searching={this.state.searching} />
      </div>
    )
  },
  handleKeydown(event) {
    //lose focus when pressing enter key, for mobile
    if (event.which == 13) {
      document.getElementsByClassName('searchInput')[0].firstElementChild.blur()
    }
    return false
  },
  componentDidMount() {
    document
      .getElementsByClassName('searchInput')[0]
      .firstElementChild.addEventListener('keydown', this.handleKeydown)
  },
  searchUpdated(term) {
    const filters = ['id', 'summary']
    const result = boards.filter(ReactSearchInput.createFilter(term, filters))
    if (typeof _paq !== 'undefined' && term.length > 2) {
      _paq.push([
        'trackSiteSearch',
        // Search keyword searched for
        term,
        // Search category selected in your search engine. If you do not need
        //this, set to false
        'Boards',
        // Number of results on the Search results page. Zero indicates a 'No
        // Result Search Keyword'. Set to false if you don't know
        result.length
      ])
    }
    this.setState({result: result, searching: term.length > 0})
  }
})

module.exports = Main
