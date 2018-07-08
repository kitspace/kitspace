"use strict";

var _zenObservableTs = _interopRequireDefault(require("zen-observable-ts"));

var _zipObservables = require("../../utils/zip-observables");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

describe('zipObservables', function () {
  beforeEach(function () {
    jest.resetAllMocks();
    jest.clearAllMocks();
    jest.restoreAllMocks();
  });
  it('combines the results of multiple observables', function (done) {
    (0, _zipObservables.zipObservables)([_zenObservableTs.default.of('a'), _zenObservableTs.default.of('b')]).subscribe(function (res) {
      expect(res).toEqual(['a', 'b']);
      done();
    });
  });
  it('handles observables with multiple emissions gracefully', function (done) {
    (0, _zipObservables.zipObservables)([_zenObservableTs.default.from(['a', 'nope']), _zenObservableTs.default.from(['b', 'also nope'])]).subscribe(function (res) {
      expect(res).toEqual(['a', 'b']);
      done();
    });
  });
  it('errors with the first error it encounters', function (done) {
    (0, _zipObservables.zipObservables)([_zenObservableTs.default.of('a'), new _zenObservableTs.default(function (observer) {
      setTimeout(function () {
        return observer.error(new Error('test'));
      });
    })]).subscribe({
      error: function error(err) {
        expect(err.message).toBe('test');
        done();
      },
      next: function next() {
        throw new Error('Should not be called');
      }
    });
  });
  it('cancels all observables when the combined subscription is cancelled', function () {
    var unsub = jest.fn();
    var obs = new _zenObservableTs.default(function (observer) {
      setTimeout(function () {
        observer.next('bla');
        observer.complete();
      });
      return unsub;
    });
    var sub = (0, _zipObservables.zipObservables)([obs]).subscribe({
      error: function error() {
        throw new Error('Should not be called');
      },
      next: function next() {
        throw new Error('Should not be called');
      }
    });
    sub.unsubscribe();
    expect(unsub).toHaveBeenCalled();
  });
});