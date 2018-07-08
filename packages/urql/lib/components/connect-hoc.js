"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireWildcard(require("react"));

var _hoistNonReactStatics = _interopRequireDefault(require("hoist-non-react-statics"));

var _connect = _interopRequireDefault(require("../components/connect"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj.default = obj; return newObj; } }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

function _inheritsLoose(subClass, superClass) { subClass.prototype = Object.create(superClass.prototype); subClass.prototype.constructor = subClass; subClass.__proto__ = superClass; }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function connect(opts) {
  return function (Comp) {
    var componentName = Comp.displayName || Comp.name || 'Component';

    var ConnectHOC =
    /*#__PURE__*/
    function (_Component) {
      _inheritsLoose(ConnectHOC, _Component);

      function ConnectHOC(props) {
        var _this;

        _this = _Component.call(this, props) || this;
        _this.props = void 0;
        _this.renderComponent = _this.renderComponent.bind(_assertThisInitialized(_assertThisInitialized(_this)));
        return _this;
      }

      var _proto = ConnectHOC.prototype;

      _proto.renderComponent = function renderComponent(data) {
        return _react.default.createElement(Comp, _extends({}, data, this.props));
      };

      _proto.render = function render() {
        var connectProps = typeof opts === 'function' ? opts(this.props) : opts;
        return _react.default.createElement(_connect.default, _extends({}, connectProps, {
          children: this.renderComponent
        }));
      };

      return ConnectHOC;
    }(_react.Component);

    ConnectHOC.displayName = "Connect(" + componentName + ")";
    return (0, _hoistNonReactStatics.default)(ConnectHOC, Comp);
  };
}

var _default = connect;
exports.default = _default;