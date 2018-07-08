"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.httpExchange = void 0;

var _zenObservableTs = _interopRequireDefault(require("zen-observable-ts"));

var _error = require("./error");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

var checkStatus = function checkStatus(redirectMode) {
  if (redirectMode === void 0) {
    redirectMode = 'follow';
  }

  return function (response) {
    // If using manual redirect mode, don't error on redirect!
    var statusRangeEnd = redirectMode === 'manual' ? 400 : 300;

    if (response.status >= 200 && response.status < statusRangeEnd) {
      return response;
    }

    throw new Error(response.statusText);
  };
};

var createAbortController = function createAbortController() {
  if (typeof AbortController === 'undefined') {
    return {
      abort: null,
      signal: undefined
    };
  }

  return new AbortController();
};

var httpExchange = function httpExchange() {
  return function (operation) {
    var _operation$context = operation.context,
        url = _operation$context.url,
        fetchOptions = _operation$context.fetchOptions;
    var operationName = operation.operationName;

    if (operationName === 'subscription') {
      throw new Error('Received a subscription operation in the httpExchange. You are probably trying to create a subscription. Have you added a subscriptionExchange?');
    }

    var body = JSON.stringify({
      query: operation.query,
      variables: operation.variables
    }); // https://developer.mozilla.org/en-US/docs/Web/API/AbortController/AbortController

    var abortController = createAbortController();
    return new _zenObservableTs.default(function (observer) {
      var response;
      fetch(url, _extends({
        body: body,
        method: 'POST',
        signal: abortController.signal
      }, fetchOptions, {
        headers: _extends({
          'Content-Type': 'application/json'
        }, fetchOptions.headers)
      })).then(function (res) {
        return response = res;
      }).then(checkStatus(fetchOptions.redirect)).then(function (res) {
        return res.json();
      }).then(function (result) {
        var error;

        if (Array.isArray(result.errors)) {
          error = new _error.CombinedError({
            graphQLErrors: result.errors,
            response: response
          });
        }

        if (result.data) {
          observer.next({
            data: result.data,
            error: error
          });
          observer.complete();
        } else if (error) {
          observer.error(error);
        } else {
          observer.error(new Error('no data or error'));
        }
      }).catch(function (err) {
        if (err.name === 'AbortError') {
          return;
        }

        var error = new _error.CombinedError({
          networkError: err,
          response: response
        });
        observer.error(error);
      });
      return function () {
        if (abortController.abort) {
          abortController.abort();
        }
      };
    });
  };
};

exports.httpExchange = httpExchange;