"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.dedupExchange = void 0;

var _zenObservableTs = _interopRequireDefault(require("zen-observable-ts"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// Wraps an exchange and deduplicates in-flight operations by their key
var dedupExchange = function dedupExchange(forward) {
  var inFlight = {};
  return function (operation) {
    var key = operation.key,
        operationName = operation.operationName; // Do not try to deduplicate mutation operations

    if (operationName === 'mutation') {
      return forward(operation);
    } // Take existing intermediate observable if it has been created


    if (inFlight[key] !== undefined) {
      return inFlight[key];
    }

    var forwarded$ = forward(operation); // Keep around one subscription and collect observers for this observable

    var observers = [];
    var refCounter = 0;
    var subscription; // Create intermediate observable and only forward to the next exchange once

    return inFlight[key] = new _zenObservableTs.default(function (observer) {
      refCounter++;
      observers.push(observer);

      if (subscription === undefined) {
        subscription = forwarded$.subscribe({
          complete: function complete() {
            delete inFlight[key];
            observers.forEach(function (x) {
              return x.complete();
            });
          },
          error: function error(_error) {
            observers.forEach(function (x) {
              return x.error(_error);
            });
          },
          next: function next(emission) {
            observers.forEach(function (x) {
              return x.next(emission);
            });
          }
        });
      }

      return function () {
        if (--refCounter === 0) {
          delete inFlight[key];
          subscription.unsubscribe();
        }
      };
    });
  };
};

exports.dedupExchange = dedupExchange;