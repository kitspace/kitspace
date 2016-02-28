const React       = require('react');
const ReactDOM    = require('react-dom');
const SearchInput = require('react-search-input');
const TitleBar    = require('./title_bar');
const BoardList   = require('./board_list');
const boards      = require('./boards.json');

const style = {
  searchContainer: {
    display:'flex',
    paddingTop:10,
    justifyContent: 'center'
  },

  iconContainer: {
    backgroundColor:'white',
    width:32,
    height:40,
    borderRadius: '5px 0 0 5px'
  },

  icon: {
    paddingTop:4,
    width:30,
    height:30
  },

}

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
          <div style={style.searchContainer}>
            <div style={style.iconContainer}>
            <img src='/images/mag_icon.svg' style={style.icon} />
            </div>
            <SearchInput
              className='search-input'
              ref='search'
              onChange={this.searchUpdated}
             />
          </div>
        </TitleBar>
        <BoardList data={this.state.result} searching={this.state.searching}/>
      </div>
    );
  },

  searchUpdated: function (term) {
    if (this.refs.search) {
      var filters = ['id', 'description'];
      var result = boards.filter(this.refs.search.filter(filters));
      if (term.length > 2) {
        //piwik tracking
        _paq.push(['trackSiteSearch',
            // Search keyword searched for
            term,
            // Search category selected in your search engine. If you do not
            // need this, set to false
            "Boards",
            // Number of results on the Search results page. Zero indicates a
            // 'No Result Search Keyword'. Set to false if you don't know
            result.length
        ]);
      }
      this.setState({result: result, searching:(term.length > 0)});
    }
  }
});

module.exports = Main;
