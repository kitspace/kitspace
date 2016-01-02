// main.js
var React = require('react');
var ReactDOM = require('react-dom');

var CommentBox = React.createClass({
  render: function() {
    return (
      <div>
        <h1>Hello, world!</h1>
        <div className="commentBox">
          Hello, world! I am a CommentBox.
        </div>
      </div>
    );
  }
});

ReactDOM.render(
  <CommentBox />,
  document.getElementById('content')
);
