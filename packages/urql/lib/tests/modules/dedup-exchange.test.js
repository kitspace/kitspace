"use strict";

var _zenObservableTs = _interopRequireDefault(require("zen-observable-ts"));

var _dedupExchange = require("../../modules/dedup-exchange");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

describe('dedupExchange', function () {
  beforeEach(function () {
    jest.resetAllMocks();
    jest.clearAllMocks();
    jest.restoreAllMocks();
  });
  it('forwards operations and subscribes', function (done) {
    var mockOp;

    var mockExchange = function mockExchange(operation) {
      return new _zenObservableTs.default(function (observer) {
        mockOp = operation;
        observer.next(operation);
        observer.complete();
      });
    };

    var testExchange = (0, _dedupExchange.dedupExchange)(mockExchange);
    var testOperation = {
      key: 'test'
    };
    testExchange(testOperation).subscribe({
      complete: done,
      next: function next(op) {
        expect(op).toBe(testOperation);
        expect(mockOp).toBe(testOperation);
      }
    });
  });
  it('returns the same intermediate observable when called with same operation', function () {
    var mockExchange = jest.fn();
    var testExchange = (0, _dedupExchange.dedupExchange)(mockExchange);
    var obsA = testExchange({
      key: 'a'
    });
    expect(mockExchange).toHaveBeenLastCalledWith({
      key: 'a'
    });
    var obsB = testExchange({
      key: 'a'
    });
    var obsC = testExchange({
      key: 'b'
    });
    expect(mockExchange).toHaveBeenLastCalledWith({
      key: 'b'
    });
    expect(obsA).toBe(obsB);
    expect(obsA).not.toBe(obsC);
    expect(mockExchange).toHaveBeenCalledTimes(2);
  });
  it('deletes intermediate observable when in-flight operation completed', function (done) {
    var mockExchange = function mockExchange() {
      return new _zenObservableTs.default(function (observer) {
        observer.next(null);
        observer.complete();
      });
    };

    var testExchange = (0, _dedupExchange.dedupExchange)(mockExchange);
    var obsA = testExchange({
      key: 'a'
    });
    obsA.subscribe({
      complete: function complete() {
        var obsB = testExchange({
          key: 'a'
        });
        expect(obsA).not.toBe(obsB);
        done();
      }
    });
  });
  it('invokes unsubscribe when all subscribers on the intermediate observable unsubscribed', function () {
    var mockUnsubscription = jest.fn();
    var testExchange = (0, _dedupExchange.dedupExchange)(function () {
      return new _zenObservableTs.default(function () {
        return mockUnsubscription;
      });
    });
    var obs = testExchange({
      key: 'a'
    });
    var sub = obs.subscribe({});
    obs.subscribe({}).unsubscribe();
    expect(mockUnsubscription).toHaveBeenCalledTimes(0);
    sub.unsubscribe();
    expect(mockUnsubscription).toHaveBeenCalledTimes(1);
  });
});