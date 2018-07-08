"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireWildcard(require("react"));

var _context = require("./context");

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj.default = obj; return newObj; } }

function _inheritsLoose(subClass, superClass) { subClass.prototype = Object.create(superClass.prototype); subClass.prototype.constructor = subClass; subClass.__proto__ = superClass; }

var Provider =
/*#__PURE__*/
function (_Component) {
  _inheritsLoose(Provider, _Component);

  function Provider() {
    return _Component.apply(this, arguments) || this;
  }

  var _proto = Provider.prototype;

  _proto.render = function render() {
    // Use react-create-context to provide client over context
    return _react.default.createElement(_context.Provider, {
      value: this.props.client
    }, this.props.children);
  };

  return Provider;
}(_react.Component);

exports.default = Provider;