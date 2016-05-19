const React       = require('react');
const SearchInput = require('react-search-input');
const TitleBar    = require('./title_bar');
const BoardList   = require('./board_list');
const boards      = require('./boards.json');

var Main = React.createClass({
  getInitialState: function() {
    return {
      result: boards,
      searching: false
    };
  },
  render: function () {
    return (
      <div>
        <TitleBar>
          <div className='searchContainer'>
            <div className='searchBackground'>
              <div className='searchInputIcon'>
                <span className='icon-search searchIcon'></span>
              </div>
              <SearchInput
                className='searchInput'
                ref='search'
                onChange={this.searchUpdated}
               />
            </div>
          </div>
        </TitleBar>
        <BoardList data={this.state.result} searching={this.state.searching}/>
      </div>
    );
  },
  handleKeydown: function(event) {
    //enter key
    if (event.which == 13) {
      document.getElementsByClassName('searchInput')[0]
      .firstElementChild.blur();
    }
    return false;
  },
  componentDidMount: function() {
    document.getElementsByClassName('searchInput')[0]
    .firstElementChild.addEventListener('keydown', this.handleKeydown);
  },
  searchUpdated: function (term) {
    if (this.refs.search) {
      var filters = ['id', 'description'];
      var result = boards.filter(this.refs.search.filter(filters));
      if (term.length > 2) {
        var cat = result.length === 0 ? 'no_result' : 'result';
        ga( //eslint-disable-line no-undef
        'send',
        'pageview',
        '/search?q=' + term + '&results=' + cat
        );
      }
      this.setState({result: result, searching:(term.length > 0)});
    }
  }
});

module.exports = Main;
