"use strict";

var _error = require("../../modules/error");

describe('CombinedError', function () {
  it('inherits from Error and is creates instances of itself', function () {
    var err = new _error.CombinedError({
      graphQLErrors: []
    });
    expect(err).toBeInstanceOf(_error.CombinedError);
    expect(err).toBeInstanceOf(Error);
    expect(err.name).toBe('CombinedError');
  });
  it('accepts graphQLError messages and generates a single message from them', function () {
    var graphQLErrors = ['Error Message A', 'Error Message B'];
    var err = new _error.CombinedError({
      graphQLErrors: graphQLErrors
    });
    expect(err.message).toBe("\n[GraphQL] Error Message A\n[GraphQL] Error Message B\n    ".trim());
    expect(err.graphQLErrors).toEqual(graphQLErrors.map(function (x) {
      return new Error(x);
    }));
  });
  it('accepts a network error and generates a message from it', function () {
    var networkError = new Error('Network Shenanigans');
    var err = new _error.CombinedError({
      networkError: networkError
    });
    expect(err.message).toBe("[Network] " + networkError.message);
  });
  it('accepts actual errors for graphQLError', function () {
    var graphQLErrors = [new Error('Error Message A'), new Error('Error Message B')];
    var err = new _error.CombinedError({
      graphQLErrors: graphQLErrors
    });
    expect(err.message).toBe("\n[GraphQL] Error Message A\n[GraphQL] Error Message B\n    ".trim());
    expect(err.graphQLErrors).toEqual(graphQLErrors);
  });
  it('passes graphQLErrors through as a last resort', function () {
    var graphQLErrors = [{
      x: 'y'
    }];
    var err = new _error.CombinedError({
      graphQLErrors: graphQLErrors
    });
    expect(err.graphQLErrors).toEqual(graphQLErrors);
  });
  it('accepts a response that is attached to the resulting error', function () {
    var response = {};
    var err = new _error.CombinedError({
      graphQLErrors: [],
      response: response
    });
    expect(err.response).toBe(response);
  });
});