(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory(require("react"));
	else if(typeof define === 'function' && define.amd)
		define("DoubleScrollbar", ["react"], factory);
	else if(typeof exports === 'object')
		exports["DoubleScrollbar"] = factory(require("react"));
	else
		root["DoubleScrollbar"] = factory(root["react"]);
})(this, function(__WEBPACK_EXTERNAL_MODULE_1__) {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	var _react = __webpack_require__(1);

	var _react2 = _interopRequireDefault(_react);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

	"use strict";

	var DoubleScrollbar = function (_React$Component) {
	  _inherits(DoubleScrollbar, _React$Component);

	  function DoubleScrollbar() {
	    _classCallCheck(this, DoubleScrollbar);

	    return _possibleConstructorReturn(this, Object.getPrototypeOf(DoubleScrollbar).apply(this, arguments));
	  }

	  _createClass(DoubleScrollbar, [{
	    key: "componentDidMount",
	    value: function componentDidMount() {
	      var outerDiv = this.refs.outerDiv;
	      var innerDiv = this.refs.innerDiv;
	      var childWrapper = this.refs.childrenWrapper;

	      //Set the width of the inner div to the first child's
	      innerDiv.style.width = childWrapper.scrollWidth + "px";

	      //assoc the scrolls
	      outerDiv.onscroll = function () {
	        childWrapper.scrollLeft = outerDiv.scrollLeft;
	      };

	      childWrapper.onscroll = function () {
	        outerDiv.scrollLeft = childWrapper.scrollLeft;
	      };
	    }
	  }, {
	    key: "render",
	    value: function render() {

	      var outerDivStyle = { overflowX: "auto", overflowY: "hidden" };
	      var innerDivStyle = { paddingTop: "1px" };
	      var childDivStyle = { overflow: "auto", overflowY: "hidden" };

	      return _react2.default.createElement(
	        "div",
	        null,
	        _react2.default.createElement(
	          "div",
	          { ref: "outerDiv", style: outerDivStyle },
	          _react2.default.createElement(
	            "div",
	            { ref: "innerDiv", style: innerDivStyle },
	            " "
	          )
	        ),
	        _react2.default.createElement(
	          "div",
	          { ref: "childrenWrapper", style: childDivStyle },
	          this.props.children
	        )
	      );
	    }
	  }]);

	  return DoubleScrollbar;
	}(_react2.default.Component);

	exports.default = DoubleScrollbar;
	module.exports = exports['default'];

/***/ },
/* 1 */
/***/ function(module, exports) {

	module.exports = __WEBPACK_EXTERNAL_MODULE_1__;

/***/ }
/******/ ])
});
;
//# sourceMappingURL=DoubleScrollbar.js.map