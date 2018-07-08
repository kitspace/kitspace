/* tslint:disable */
import React from 'react';
import Provider from "../../components/provider";
import renderer from 'react-test-renderer';
describe('Provider Component', function () {
  it('should provide a context consumer and pass through to client', function () {
    // @ts-ignore
    var component = renderer.create( // @ts-ignore
    React.createElement(Provider, {
      client: "test"
    }, React.createElement("div", null)));
    var tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });
});