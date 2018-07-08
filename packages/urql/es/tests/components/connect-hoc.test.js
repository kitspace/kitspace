function _inheritsLoose(subClass, superClass) { subClass.prototype = Object.create(superClass.prototype); subClass.prototype.constructor = subClass; subClass.__proto__ = superClass; }

/* tslint:disable */
import React, { Component } from 'react';
import ConnectHOC from "../../components/connect-hoc";
import renderer from 'react-test-renderer';
describe('Connect HOC', function () {
  it('should wrap its component argument with connect', function () {
    var Comp = function Comp(args) {
      return React.createElement("div", args);
    };

    var Wrapped = ConnectHOC()(Comp); // @ts-ignore

    var component = renderer.create( // @ts-ignore
    React.createElement(Wrapped, null));
    var tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });
  it('should wrap its component argument with connect with functional options', function () {
    var Comp = function Comp(args) {
      return React.createElement("div", args);
    };

    var Wrapped = ConnectHOC(function (props) {
      return {
        cache: props.cache
      };
    })(Comp); // @ts-ignore

    var component = renderer.create( // @ts-ignore
    React.createElement(Wrapped, {
      cache: false
    }));
    var tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });
  it('should wrap its component argument with connect and hoist the statics', function () {
    var Comp =
    /*#__PURE__*/
    function (_React$Component) {
      _inheritsLoose(Comp, _React$Component);

      function Comp() {
        return _React$Component.apply(this, arguments) || this;
      }

      var _proto = Comp.prototype;

      _proto.render = function render() {
        return React.createElement("div", this.props);
      };

      return Comp;
    }(React.Component);

    Comp.foo = {
      bar: 'foobar'
    };
    var Wrapped = ConnectHOC()(Comp); // @ts-ignore

    var component = renderer.create( // @ts-ignore
    React.createElement(Wrapped, null));
    expect(Wrapped).toHaveProperty('foo', {
      bar: 'foobar'
    });
    var tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });
  it('should assign reasonable displayNames to components', function () {
    var Comp =
    /*#__PURE__*/
    function (_Component) {
      _inheritsLoose(Comp, _Component);

      function Comp() {
        return _Component.apply(this, arguments) || this;
      }

      var _proto2 = Comp.prototype;

      _proto2.render = function render() {
        return null;
      };

      return Comp;
    }(Component);

    Comp.displayName = 'Test';
    expect(ConnectHOC()(Comp).displayName).toBe('Connect(Test)');

    var TestComp = function TestComp() {
      return null;
    };

    expect(ConnectHOC()(TestComp).displayName).toBe('Connect(TestComp)');
    expect(ConnectHOC()({}).displayName).toBe('Connect(Component)');
  });
});