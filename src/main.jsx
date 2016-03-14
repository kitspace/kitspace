const React       = require('react');
const ReactDOM    = require('react-dom');
const SearchInput = require('react-search-input');
const TitleBar    = require('./title_bar');
const BoardList   = require('./board_list');
const boards      = require('./boards.json');

const style = {
  icon: {
    width:'100%',
  }

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
          <div className='searchContainer'>
            <div className='search-input-icon'>
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
        var cat = result.length === 0 ? 'no_result' : 'result';
        ga('send', 'pageview', '/search?q=' + term + '&results=' + cat);
      }
      this.setState({result: result, searching:(term.length > 0)});
    }
  }
});

module.exports = Main;
