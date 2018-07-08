function _inheritsLoose(subClass, superClass) { subClass.prototype = Object.create(superClass.prototype); subClass.prototype.constructor = subClass; subClass.__proto__ = superClass; }

import React, { Component } from 'react';
import ClientWrapper from "./client";
import { Consumer } from "./context";

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
    return React.createElement(Consumer, null, function (client) {
      return React.createElement(ClientWrapper, {
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
}(Component);

export { Connect as default };