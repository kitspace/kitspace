'use strict';
const React = require('react');
const zipPath = require('./zip-info.json');
let Gerbers = React.createClass({
	render: function() {
		return (
			<div className="gerbersContainer">
				<a className="zipPath" ref={zipPath}>
					<div className="gerbers">
						<i className="octicon octicon-circuit-board"></i>
						{` `}Download Gerber
					</div>
				</a>
			</div>
		);
	}
});
module.exports = Gerbers;