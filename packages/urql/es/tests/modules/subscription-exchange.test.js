import { subscriptionExchange } from "../../modules/subscription-exchange";
import { CombinedError } from "../../modules/error";
describe('subscriptionExchange', function () {
  beforeEach(function () {
    jest.resetAllMocks();
    jest.clearAllMocks();
    jest.restoreAllMocks();
  });
  it('ignores non-subscription operations', function () {
    var forward = jest.fn();
    var createSubscription = jest.fn();
    var exchange = subscriptionExchange(createSubscription, forward);
    exchange({
      operationName: 'query'
    });
    expect(createSubscription).not.toHaveBeenCalled();
    expect(forward).toHaveBeenCalled();
  });
  it('creates a continuous exchange observable with a sub-observer', function (done) {
    var exOperation = {
      key: 'test',
      operationName: 'subscription'
    };
    var next = jest.fn();
    var error = jest.fn();
    var unsubscribe = jest.fn();

    var createSubscription = function createSubscription(operation, observer) {
      expect(operation).toBe(exOperation);
      expect(observer.next).toBeTruthy();
      expect(observer.error).toBeTruthy();
      setTimeout(function () {
        var inputA = {
          data: 'test'
        };
        expect(next).not.toHaveBeenCalled();
        observer.next(inputA); // Inputs are passed through with their data

        expect(next).toHaveBeenLastCalledWith(inputA);
        var inputB = {
          errors: ['test error']
        };
        observer.next(inputB); // Errors on data are "packaged up" in CombinedError

        expect(next).toHaveBeenLastCalledWith({
          data: undefined,
          error: new CombinedError({
            graphQLErrors: ['test error']
          })
        });
        expect(error).not.toHaveBeenCalled();
        var inputErr = new Error('test');
        observer.error(inputErr); // Error emissions are "packaged up" as CombinedError

        expect(error).toHaveBeenCalledWith(new CombinedError({
          networkError: inputErr
        }));
        done();
      });
      return {
        unsubscribe: unsubscribe
      };
    };

    var exchange = subscriptionExchange(createSubscription, null);
    exchange(exOperation).subscribe({
      error: error,
      next: next
    });
  });
  it('passes up the unsubscribe into the user’s returned subscription', function () {
    var exOperation = {
      key: 'test',
      operationName: 'subscription'
    };
    var unsubscribe = jest.fn();

    var createSubscription = function createSubscription() {
      return {
        unsubscribe: unsubscribe
      };
    };

    var exchange = subscriptionExchange(createSubscription, null);
    exchange(exOperation).subscribe(function () {
      throw new Error('Should not be called');
    }).unsubscribe();
    expect(unsubscribe).toHaveBeenCalled();
  });
});