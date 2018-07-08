"use strict";

var _react = _interopRequireDefault(require("react"));

var _connect = _interopRequireDefault(require("../../components/connect"));

var _reactTestRenderer = _interopRequireDefault(require("react-test-renderer"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/* tslint:disable */
describe('Client Component', function () {
  it('should provide a context consumer and pass through to client', function () {
    // @ts-ignore
    var component = _reactTestRenderer.default.create(_react.default.createElement(_connect.default, {
      children: function children(args) {
        return _react.default.createElement("div", args);
      }
    }));

    var tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });
});