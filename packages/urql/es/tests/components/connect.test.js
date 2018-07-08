/* tslint:disable */
import React from 'react';
import Connect from "../../components/connect";
import renderer from 'react-test-renderer';
describe('Client Component', function () {
  it('should provide a context consumer and pass through to client', function () {
    // @ts-ignore
    var component = renderer.create(React.createElement(Connect, {
      children: function children(args) {
        return React.createElement("div", args);
      }
    }));
    var tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });
});