import Observable from 'zen-observable-ts';
import { CombinedError } from "./error";
export var subscriptionExchange = function subscriptionExchange(createSubscription, forward) {
  return function (operation) {
    var operationName = operation.operationName; // Forward non-subscription operations

    if (operationName !== 'subscription') {
      return forward(operation);
    } // Take over subscription operations and call `createSubscription`


    return new Observable(function (observer) {
      var subObserver = {
        error: function error(networkError) {
          observer.error(new CombinedError({
            networkError: networkError
          }));
        },
        next: function next(raw) {
          var result = {
            data: raw.data
          };

          if (Array.isArray(raw.errors)) {
            result.error = new CombinedError({
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