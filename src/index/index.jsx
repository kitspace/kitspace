const React            = require('react')
const ReactSearchInput = require('react-search-input')
const superagent       = require('superagent')

const BoardList = require('./board_list')

const TitleBar = require('../title_bar')
const boards   = require('../boards.json')

const SearchInput = ReactSearchInput.default


var Main = React.createClass({
  getInitialState: function() {
    return {
      result: boards,
      searching: false,
      user: null,
    }
  },
  componentDidMount() {
    document.getElementsByClassName('searchInput')[0]
      .firstElementChild.addEventListener('keydown', this.handleKeydown)
    superagent.get('/accounts/api/v4/user')
      .set('Accept', 'application/json')
      .withCredentials()
      .then(r => this.setState({user: r.body}))
      .catch(e => this.setState({user: 'not signed in'}))
    //set the state to loading if it hasn't gotten the user info after a second
    setTimeout(() => {
      if (this.state.user == null) {
        this.setState({user: 'loading'})
      }
    }, 1000)
  },
  render: function () {
    return (
      <div>
        <TitleBar user={this.state.user} submissionButton={true}>
          <div className='searchContainer'>
            <div className='searchBackground'>
              <div className='searchInputIcon'>
                <span className='icon-search searchIcon'></span>
              </div>
              <SearchInput
                className='searchInput'
                onChange={this.searchUpdated}
               />
            </div>
          </div>
        </TitleBar>
        <BoardList data={this.state.result} searching={this.state.searching}/>
      </div>
    )
  },
  handleKeydown: function(event) {
    //lose focus when pressing enter key, for mobile
    if (event.which == 13) {
      document.getElementsByClassName('searchInput')[0]
      .firstElementChild.blur()
    }
    return false
  },
  searchUpdated: function (term) {
    const filters = ['id', 'summary']
    const result = boards.filter(ReactSearchInput.createFilter(term, filters))
    if (term.length > 2) {
      _paq.push(['trackSiteSearch',
          // Search keyword searched for
          term,
	  // Search category selected in your search engine. If you do not need
          //this, set to false
          "Boards",
	  // Number of results on the Search results page. Zero indicates a 'No
          // Result Search Keyword'. Set to false if you don't know
          result.length
      ])
    }
    this.setState({result: result, searching:(term.length > 0)})
  }
})

module.exports = Main
