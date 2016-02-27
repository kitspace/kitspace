const React       = require('react');
const ReactDOM    = require('react-dom');
const BoardThumb  = require('./BoardThumb');

var BoardList = React.createClass({
  render: function () {
    var initialLoad = !(this.props.searching);
    if (this.props.data.length === 0) {
      return (
        <div>
          <div style={{height:'40%'}}></div>
          <div style={{width:'100%', textAlign:'center'}}>
                No results
          </div>
        </div>
      );
    }
    var thumbNodes = this.props.data.map(function(data, index) {
      return (
        <BoardThumb data={data} key={data.id + index}
          lazyLoad={ (! initialLoad) || (index > 10) }/>
      );
    });
    var intro = (
      <div style=
        {{
          marginLeft:'10%'
          , marginRight:'10%'
          , marginTop:32
          , marginBottom: 32
          , display:(initialLoad ? 'inherit' : 'none')
      }}>
      <center>
        <div style=
          {{
            backgroundColor: '#FAFAFA'
            , padding: 20
            , borderRadius: 5
            , textAlign:'left'
            , maxWidth:700
        }}>
        <p>

          Kitnic is a registry of open hardware electronics projects that are
          ready for you to order and build. Or at least that's the plan, this
          is early stages yet. If you notice any problems please
          <a href='https://github.com/monostable/kitnic/issues'> get in touch </a>.

        </p><p>

          Click on any project to get further info, download the gerbers and see
          the bill of materials.

        </p><p>

          To quickly purchase the parts from various retailers you should
          <a href='http://1clickBOM.com'> install</a> the 1-click-BOM extension.
          It's pretty useful on it's own too and can be used on other sites.
          Read more about it <a href='http://1clickBOM.com'>here</a>.

        </p><p>

          <a href='https://github.com/monostable/kitnic/#submitting-your-project-repo'> Submit</a> your own project to have it listed here!

        </p>
      </div>
      </center>
      </div>
    );
    return (
      <div>
          {intro}
        <div style={{margin: 32, textAlign:'center'}}>
          {thumbNodes}
        </div>
      </div>
    );
  }
});

module.exports = BoardList;
