const React    = require('react');
const ReactDOM = require('react-dom');

var BoardShowcase = React.createClass({
	getInitialState: function() {
		return {
			viewFrontBoard:1
		}
	},
	frontBoardView: function(e) {
		e.preventDefault();
		this.setState({
			viewFrontBoard:1
		});
	},
	backBoardView: function(e) {
		e.preventDefault();
		this.setState({
			viewFrontBoard:0
		});
	},
	render: function () {
		var frontBoardClass = 'frontBoard boardDiagram ';
		var backBoardClass = 'backBoard boardDiagram ';
		if (this.state.viewFrontBoard) {
			frontBoardClass += ' selectedBoard';
		}else{
			backBoardClass += ' selectedBoard';
		}
		return (
			<div className="boardShowcaseContainer">
				<div className="toggleBoardView">
					<button disabled={this.state.viewFrontBoard} className="circuitToggleBtn circuitFrontBtn" onClick={this.frontBoardView}>
						Front
					</button>
					<button disabled={!this.state.viewFrontBoard} className="circuitToggleBtn circuitBackBtn" onClick={this.backBoardView}>
						Back
					</button>
				</div>
				<div className="boardShowcase">
					<div className="boardEdge"></div>
					<div className="boardContainer">
						<img className={frontBoardClass} src='images/top.svg'/>
						<div className="circuitBorderContainer">
							<div className="circuitBorder"></div>
						</div>
						<img className={backBoardClass} src='images/bottom.svg'/>
					</div>
					<div className="boardEdge"></div>
				</div>
			</div>
		);
	}
});
module.exports = BoardShowcase;