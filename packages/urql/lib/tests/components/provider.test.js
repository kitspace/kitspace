"use strict";

var _react = _interopRequireDefault(require("react"));

var _provider = _interopRequireDefault(require("../../components/provider"));

var _reactTestRenderer = _interopRequireDefault(require("react-test-renderer"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/* tslint:disable */
describe('Provider Component', function () {
  it('should provide a context consumer and pass through to client', function () {
    // @ts-ignore
    var component = _reactTestRenderer.default.create( // @ts-ignore
    _react.default.createElement(_provider.default, {
      client: "test"
    }, _react.default.createElement("div", null)));

    var tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });
});