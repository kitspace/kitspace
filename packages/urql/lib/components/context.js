"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Consumer = exports.Provider = void 0;

var _createReactContext = _interopRequireDefault(require("create-react-context"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var context = (0, _createReactContext.default)({}); // TypeScript is very pedantic about re-exporting dependencies when doing
// --declaration emit, so we need to import ComponentClass. But if we don't
// explicitly use ComponentClass somewhere in the code, TypeScript *also*
// ends up issuing an error. This is dumb, but this all gets erased anyway.

var Provider = context.Provider,
    Consumer = context.Consumer;
exports.Consumer = Consumer;
exports.Provider = Provider;