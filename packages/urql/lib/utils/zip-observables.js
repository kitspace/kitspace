"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.zipObservables = void 0;

var _zenObservableTs = _interopRequireDefault(require("zen-observable-ts"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/* takes an array of observables all emitting one value each,
 * and zips all results into one result observable */
var zipObservables = function zipObservables(obs) {
  return new _zenObservableTs.default(function (observer) {
    var size = obs.length;
    var res = new Array(size);
    var complete = false;
    var received = 0;
    var subs = []; // unsubscription function iterating over each subscription

    var unsubscribe = function unsubscribe() {
      complete = true;
      subs.forEach(function (sub) {
        return sub.unsubscribe();
      });
    }; // Subscribe to each observable and map to subscriptions


    subs = obs.map(function (o, i) {
      return o.subscribe({
        error: function error(_error) {
          observer.error(_error);
          unsubscribe();
        },
        next: function next(value) {
          // limit to a single emitted value
          if (res[i] === undefined) {
            // set value on result array
            res[i] = value; // If all values have been received and the observer hasn't unsubscribed

            if (++received === size && !complete) {
              // Emit zipped result and complete
              observer.next(res);
              observer.complete();
              complete = true;
            }
          }
        }
      });
    });
    return unsubscribe;
  });
};

exports.zipObservables = zipObservables;