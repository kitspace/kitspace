import { CombinedError } from "../../modules/error";
import { httpExchange } from "../../modules/http-exchange";
describe('httpExchange', function () {
  beforeEach(function () {
    jest.resetAllMocks();
    jest.clearAllMocks();
    jest.restoreAllMocks();
    global.AbortController = global._AbortController;
  });
  afterEach(function () {
    global.AbortController = undefined;
  });
  it('accepts an operation and sends a request', function (done) {
    global.fetch.mockReturnValue(Promise.resolve({
      json: function json() {
        return {
          data: [{
            id: 5
          }]
        };
      },
      status: 200
    }));
    var exchange = httpExchange();
    var operation = {
      context: {
        fetchOptions: {
          test: 1
        },
        url: 'http://localhost:3000/graphql'
      },
      key: 'test',
      operationName: 'query',
      query: "{ ping }",
      variables: {}
    };
    exchange(operation).subscribe({
      error: function error(err) {
        throw err;
      },
      next: function next(x) {
        expect(x).toEqual({
          data: [{
            id: 5
          }]
        });
        expect(global.fetch).toHaveBeenCalledWith('http://localhost:3000/graphql', {
          body: JSON.stringify({
            query: "{ ping }",
            variables: {}
          }),
          headers: {
            'Content-Type': 'application/json'
          },
          method: 'POST',
          signal: expect.any(Object),
          test: 1
        });
        done();
      }
    });
  });
  it('errors with CombinedError', function (done) {
    var response = {
      json: function json() {
        return {
          errors: ['error message']
        };
      },
      status: 200
    };
    global.fetch.mockReturnValue(Promise.resolve(response));
    var exchange = httpExchange();
    var operation = {
      context: {
        fetchOptions: {},
        url: 'http://localhost:3000/graphql'
      },
      key: 'test',
      operationName: 'query',
      query: "{ ping }"
    };
    exchange(operation).subscribe({
      error: function error(err) {
        expect(err).toBeInstanceOf(CombinedError);
        done();
      },
      next: function next() {
        throw new Error('Should not be called');
      }
    });
  });
  it('is cancellable using an unsubscription', function () {
    var abort = jest.fn();
    var signal = {
      signal: 1
    };
    global.AbortController = jest.fn().mockImplementation(function () {
      return {
        abort: abort,
        signal: signal
      };
    });
    global.fetch.mockReturnValue(new Promise(function (resolve) {
      setTimeout(function () {
        return resolve({
          json: function json() {
            return {
              errors: ['should not be called']
            };
          },
          status: 200
        });
      }, 50);
    }));
    var exchange = httpExchange();
    var operation = {
      context: {
        fetchOptions: {},
        url: 'http://localhost:3000/graphql'
      },
      key: 'test',
      operationName: 'query',
      query: "{ ping }"
    };
    var subscription = exchange(operation).subscribe({
      error: function error() {
        throw new Error('Should not be called');
      },
      next: function next() {
        throw new Error('Should not be called');
      }
    });
    subscription.unsubscribe();
    expect(global.fetch).toHaveBeenCalledWith('http://localhost:3000/graphql', {
      body: JSON.stringify({
        query: "{ ping }"
      }),
      headers: {
        'Content-Type': 'application/json'
      },
      method: 'POST',
      signal: signal
    });
    expect(abort).toHaveBeenCalled();
  });
  it('throws when no data or errors have been returned', function (done) {
    global.fetch.mockReturnValue(Promise.resolve({
      json: function json() {
        return {};
      },
      status: 200
    }));
    var exchange = httpExchange();
    var operation = {
      context: {
        fetchOptions: {},
        url: 'http://localhost:3000/graphql'
      },
      key: 'test',
      operationName: 'query',
      query: "{ ping }"
    };
    exchange(operation).subscribe({
      error: function error(err) {
        expect(err.message).toBe('no data or error');
        done();
      },
      next: function next() {
        throw new Error('Should not be called');
      }
    });
  });
  it('ignores AbortErrors', function (done) {
    var err = new Error();
    err.name = 'AbortError';
    global.fetch.mockReturnValue(Promise.reject(err));
    var exchange = httpExchange();
    var operation = {
      context: {
        fetchOptions: {},
        url: 'http://localhost:3000/graphql'
      },
      key: 'test',
      operationName: 'query',
      query: "{ ping }"
    };
    exchange(operation).subscribe({
      error: function error() {
        throw new Error('Should not be called');
      },
      next: function next() {
        throw new Error('Should not be called');
      }
    });
    setTimeout(done);
  });
  it('does not error on manual redirect mode for 3xx status codes', function (done) {
    global.fetch.mockReturnValue(Promise.resolve({
      json: function json() {
        return {
          data: [{
            id: 5
          }]
        };
      },
      status: 302
    }));
    var exchange = httpExchange();
    var operation = {
      context: {
        fetchOptions: {
          redirect: 'manual'
        },
        url: 'http://localhost:3000/graphql'
      },
      key: 'test',
      operationName: 'query',
      query: "{ ping }",
      variables: {}
    };
    exchange(operation).subscribe({
      error: function error(err) {
        throw err;
      },
      next: function next(x) {
        expect(x).toEqual({
          data: [{
            id: 5
          }]
        });
        done();
      }
    });
  });
  it('errors outside of 2xx status code in the usual redirect mode', function (done) {
    global.fetch.mockReturnValue(Promise.resolve({
      json: function json() {
        return {
          data: [{
            id: 5
          }]
        };
      },
      statusText: 'test',
      status: 302
    }));
    var exchange = httpExchange();
    var operation = {
      context: {
        fetchOptions: {},
        url: 'http://localhost:3000/graphql'
      },
      key: 'test',
      operationName: 'query',
      query: "{ ping }",
      variables: {}
    };
    exchange(operation).subscribe({
      error: function error(err) {
        expect(err.networkError.message).toBe('test');
        done();
      },
      next: function next() {
        throw new Error('Should not be called');
      }
    });
  });
  it('logs a warning when used for subscriptions', function () {
    expect(function () {
      httpExchange()({
        context: {},
        operationName: 'subscription'
      });
    }).toThrowErrorMatchingSnapshot();
  });
});