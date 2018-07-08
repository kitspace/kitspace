"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireWildcard(require("react"));

var _client = _interopRequireDefault(require("./client"));

var _context = require("./context");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj.default = obj; return newObj; } }

function _inheritsLoose(subClass, superClass) { subClass.prototype = Object.create(superClass.prototype); subClass.prototype.constructor = subClass; subClass.__proto__ = superClass; }

var Connect =
/*#__PURE__*/
function (_Component) {
  _inheritsLoose(Connect, _Component);

  function Connect() {
    return _Component.apply(this, arguments) || this;
  }

  var _proto = Connect.prototype;

  _proto.render = function render() {
    var _this = this;

    // Use react-create-context to provide context to ClientWrapper
    return _react.default.createElement(_context.Consumer, null, function (client) {
      return _react.default.createElement(_client.default, {
        client: client,
        children: _this.props.children,
        subscription: _this.props.subscription,
        query: _this.props.query,
        mutation: _this.props.mutation,
        updateSubscription: _this.props.updateSubscription,
        cache: _this.props.cache,
        typeInvalidation: _this.props.typeInvalidation,
        shouldInvalidate: _this.props.shouldInvalidate
      });
    });
  };

  return Connect;
}(_react.Component);

exports.default = Connect;