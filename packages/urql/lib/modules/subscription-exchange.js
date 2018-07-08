"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.subscriptionExchange = void 0;

var _zenObservableTs = _interopRequireDefault(require("zen-observable-ts"));

var _error = require("./error");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var subscriptionExchange = function subscriptionExchange(createSubscription, forward) {
  return function (operation) {
    var operationName = operation.operationName; // Forward non-subscription operations

    if (operationName !== 'subscription') {
      return forward(operation);
    } // Take over subscription operations and call `createSubscription`


    return new _zenObservableTs.default(function (observer) {
      var subObserver = {
        error: function error(networkError) {
          observer.error(new _error.CombinedError({
            networkError: networkError
          }));
        },
        next: function next(raw) {
          var result = {
            data: raw.data
          };

          if (Array.isArray(raw.errors)) {
            result.error = new _error.CombinedError({
              graphQLErrors: raw.errors
            });
          }

          observer.next(result);
        }
      };
      var sub = createSubscription(operation, subObserver);
      return function () {
        sub.unsubscribe();
      };
    });
  };
};

exports.subscriptionExchange = subscriptionExchange;