function _inheritsLoose(subClass, superClass) { subClass.prototype = Object.create(superClass.prototype); subClass.prototype.constructor = subClass; subClass.__proto__ = superClass; }

import React, { Component } from 'react';
import { Provider as ContextProvider } from "./context";

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
    return React.createElement(ContextProvider, {
      value: this.props.client
    }, this.props.children);
  };

  return Provider;
}(Component);

export { Provider as default };