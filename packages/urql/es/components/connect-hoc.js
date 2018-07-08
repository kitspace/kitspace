function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

function _inheritsLoose(subClass, superClass) { subClass.prototype = Object.create(superClass.prototype); subClass.prototype.constructor = subClass; subClass.__proto__ = superClass; }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

import React, { Component } from 'react';
import hoistStatics from 'hoist-non-react-statics';
import Connect from "../components/connect";

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
        return React.createElement(Comp, _extends({}, data, this.props));
      };

      _proto.render = function render() {
        var connectProps = typeof opts === 'function' ? opts(this.props) : opts;
        return React.createElement(Connect, _extends({}, connectProps, {
          children: this.renderComponent
        }));
      };

      return ConnectHOC;
    }(Component);

    ConnectHOC.displayName = "Connect(" + componentName + ")";
    return hoistStatics(ConnectHOC, Comp);
  };
}

export default connect;