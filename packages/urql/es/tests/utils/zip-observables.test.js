import Observable from 'zen-observable-ts';
import { zipObservables } from "../../utils/zip-observables";
describe('zipObservables', function () {
  beforeEach(function () {
    jest.resetAllMocks();
    jest.clearAllMocks();
    jest.restoreAllMocks();
  });
  it('combines the results of multiple observables', function (done) {
    zipObservables([Observable.of('a'), Observable.of('b')]).subscribe(function (res) {
      expect(res).toEqual(['a', 'b']);
      done();
    });
  });
  it('handles observables with multiple emissions gracefully', function (done) {
    zipObservables([Observable.from(['a', 'nope']), Observable.from(['b', 'also nope'])]).subscribe(function (res) {
      expect(res).toEqual(['a', 'b']);
      done();
    });
  });
  it('errors with the first error it encounters', function (done) {
    zipObservables([Observable.of('a'), new Observable(function (observer) {
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
    var obs = new Observable(function (observer) {
      setTimeout(function () {
        observer.next('bla');
        observer.complete();
      });
      return unsub;
    });
    var sub = zipObservables([obs]).subscribe({
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