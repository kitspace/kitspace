/* tslint:disable */
import React from 'react';
import Client from "../../components/client";
import { CombinedError } from "../../modules/error";
import { hashString } from "../../modules/hash";
import { formatTypeNames } from "../../modules/typenames";
import { default as ClientModule } from "../../modules/client";
import { subscriptionExchange } from "../../modules/subscription-exchange";
import { ClientEventType } from "../../interfaces/index";
import renderer from 'react-test-renderer';
describe('Client Component', function () {
  beforeEach(function () {
    jest.resetAllMocks();
    jest.clearAllMocks();
    jest.restoreAllMocks();
  });
  it('should return null with no render function', function () {
    // @ts-ignore
    var component = renderer.create(React.createElement(Client, null));
    var tree = component.toJSON();
    expect(tree).toBeNull();
    component.update(React.createElement(Client // @ts-ignore
    , {
      children: function children() {
        return React.createElement("div", null, "hey");
      }
    }));
    tree = component.toJSON();
    expect(tree).toBeTruthy();
  });
  it('should use the render prop when supplied and render the defaults', function (done) {
    // @ts-ignore
    var client = renderer.create(React.createElement(Client // @ts-ignore
    , {
      children: function children(_ref) {
        var data = _ref.data,
            error = _ref.error,
            fetching = _ref.fetching,
            loaded = _ref.loaded,
            refetch = _ref.refetch;
        expect(data).toBeNull();
        expect(error).toBeNull();
        expect(fetching).toBe(false);
        expect(loaded).toBe(false);
        expect(refetch).toBeInstanceOf(Function);
        done();
        return null;
      }
    }));
  });
  it('should return the proper render prop arguments with a query supplied', function (done) {
    global.fetch.mockReturnValue(Promise.resolve({
      status: 200,
      json: function json() {
        return {
          data: {
            todos: [{
              id: 1
            }]
          }
        };
      }
    }));
    var clientModule = new ClientModule({
      url: 'test'
    });
    var result; // @ts-ignore

    var client = renderer.create(React.createElement(Client, {
      client: clientModule // @ts-ignore
      ,
      query: {
        query: "{ todos { id } }"
      } // @ts-ignore
      ,
      children: function children(args) {
        result = args;
        return null;
      }
    }));
    var _result = result,
        data = _result.data,
        error = _result.error,
        fetching = _result.fetching,
        loaded = _result.loaded,
        refetch = _result.refetch;
    expect(data).toBeNull();
    expect(error).toBeNull();
    expect(fetching).toBe(true);
    expect(loaded).toBe(false);
    expect(refetch).toBeInstanceOf(Function);
    setTimeout(function () {
      var _result2 = result,
          data = _result2.data,
          error = _result2.error,
          fetching = _result2.fetching,
          loaded = _result2.loaded,
          refetch = _result2.refetch;
      expect(data).toMatchObject({
        todos: [{
          id: 1
        }]
      });
      expect(error).toBe(undefined);
      expect(fetching).toBe(false);
      expect(loaded).toBe(true);
      expect(refetch).toBeInstanceOf(Function);
      done();
    }, 200);
  });
  it('should format new props', function (done) {
    global.fetch.mockReturnValue(Promise.resolve({
      status: 200,
      json: function json() {
        return {
          data: {
            todos: [{
              id: 1
            }]
          }
        };
      }
    }));
    var clientModule = new ClientModule({
      url: 'test'
    }); // @ts-ignore

    var result; // @ts-ignore

    var client = renderer.create(React.createElement(Client, {
      key: "test",
      client: clientModule // @ts-ignore
      ,
      query: {
        query: "{ todos { id } }"
      } // @ts-ignore
      ,
      children: function children(args) {
        result = args;
        return null;
      }
    }));
    client.update(React.createElement(Client, {
      key: "test",
      client: clientModule // @ts-ignore
      ,
      query: {
        query: "{ posts { id } }"
      } // @ts-ignore
      ,
      children: function children(args) {
        result = args;
        return null;
      }
    }));
    expect(client.getInstance().query).toMatchObject({
      query: "{\n  posts {\n    id\n    __typename\n  }\n}\n",
      variables: undefined
    });
    client.update(React.createElement(Client, {
      key: "test",
      client: clientModule // @ts-ignore
      ,
      query: [{
        query: "{ posts { id } }"
      }, {
        query: "{ posts { id } }"
      }] // @ts-ignore
      ,
      children: function children(args) {
        result = args;
        return null;
      }
    }));
    expect(client.getInstance().query).toMatchObject([{
      query: "{\n  posts {\n    id\n    __typename\n  }\n}\n",
      variables: undefined
    }, {
      query: "{\n  posts {\n    id\n    __typename\n  }\n}\n",
      variables: undefined
    }]);
    done();
  });
  it('should format new mutations', function () {
    global.fetch.mockReturnValue(Promise.resolve({
      status: 200,
      json: function json() {
        return {
          data: {
            todos: [{
              id: 1
            }]
          }
        };
      }
    }));
    var clientModule = new ClientModule({
      url: 'test'
    }); // @ts-ignore

    var result; // @ts-ignore

    var client = renderer.create(React.createElement(Client // @ts-ignore
    , {
      key: "test",
      client: clientModule // @ts-ignore
      ,
      mutation: {
        addTodo: {
          query: "{ todos { id } }",
          variables: undefined
        }
      } // @ts-ignore
      ,
      children: function children(args) {
        result = args;
        return null;
      }
    }));
    expect(Object.keys(client.getInstance().mutations)).toMatchObject(['addTodo']);
    client.update(React.createElement(Client // @ts-ignore
    , {
      key: "test",
      client: clientModule // @ts-ignore
      ,
      mutation: {
        removeTodo: {
          query: "{ todos { id } }",
          variables: undefined
        }
      } // @ts-ignore
      ,
      children: function children(args) {
        result = args;
        return null;
      }
    }));
    expect(Object.keys(client.getInstance().mutations)).toMatchObject(['removeTodo']);
  });
  it('should return an error thrown by fetch', function (done) {
    global.fetch.mockReturnValue(Promise.reject(new Error('oh no!')));
    var clientModule = new ClientModule({
      url: 'test'
    });
    var result; // @ts-ignore

    var client = renderer.create(React.createElement(Client, {
      client: clientModule // @ts-ignore
      ,
      query: {
        query: "{ todos { id } }"
      } // @ts-ignore
      ,
      children: function children(args) {
        result = args;
        return null;
      }
    }));
    var _result3 = result,
        data = _result3.data,
        error = _result3.error,
        fetching = _result3.fetching,
        loaded = _result3.loaded,
        refetch = _result3.refetch;
    expect(data).toBeNull();
    expect(error).toBeNull();
    expect(fetching).toBe(true);
    expect(loaded).toBe(false);
    expect(refetch).toBeInstanceOf(Function);
    setTimeout(function () {
      var _result4 = result,
          data = _result4.data,
          error = _result4.error,
          fetching = _result4.fetching,
          loaded = _result4.loaded,
          refetch = _result4.refetch;
      expect(data).toBeNull();
      expect(error.networkError).toMatchObject(new Error('oh no!'));
      expect(fetching).toBe(false);
      expect(loaded).toBe(false);
      expect(refetch).toBeInstanceOf(Function);
      done();
    }, 200);
  });
  it('should return the proper render prop arguments with multiple queries supplied', function (done) {
    global.fetch.mockReturnValue(Promise.resolve({
      status: 200,
      json: function json() {
        return {
          data: {
            todos: [{
              id: 1,
              __typename: 'Todo'
            }]
          }
        };
      }
    }));
    var clientModule = new ClientModule({
      url: 'test'
    });
    var result; // @ts-ignore

    var client = renderer.create(React.createElement(Client, {
      client: clientModule // @ts-ignore
      ,
      query: [{
        query: "{ todos { id } }"
      }, {
        query: "{ todos { id } }"
      }] // @ts-ignore
      ,
      children: function children(args) {
        result = args;
        return null;
      }
    }));
    var _result5 = result,
        data = _result5.data,
        error = _result5.error,
        fetching = _result5.fetching,
        loaded = _result5.loaded,
        refetch = _result5.refetch;
    expect(data).toBeNull();
    expect(error).toBeNull();
    expect(fetching).toBe(true);
    expect(loaded).toBe(false);
    expect(refetch).toBeInstanceOf(Function);
    setTimeout(function () {
      var _result6 = result,
          data = _result6.data,
          error = _result6.error,
          fetching = _result6.fetching,
          loaded = _result6.loaded,
          refetch = _result6.refetch;
      expect(data).toMatchObject([{
        todos: [{
          id: 1
        }]
      }, {
        todos: [{
          id: 1
        }]
      }]);
      expect(error).toBeNull();
      expect(fetching).toBe(false);
      expect(loaded).toBe(true);
      expect(refetch).toBeInstanceOf(Function);
      done();
    }, 200);
  });
  it('should return the proper render prop arguments with multiple queries supplied and an error', function (done) {
    global.fetch.mockReturnValue(Promise.reject(new Error('lol')));
    var clientModule = new ClientModule({
      url: 'test'
    });
    var result; // @ts-ignore

    var client = renderer.create(React.createElement(Client, {
      client: clientModule // @ts-ignore
      ,
      query: [{
        query: "{ todos { id } }"
      }, {
        query: "{ todos { id } }"
      }] // @ts-ignore
      ,
      children: function children(args) {
        result = args;
        return null;
      }
    }));
    setTimeout(function () {
      var _result7 = result,
          data = _result7.data,
          error = _result7.error,
          fetching = _result7.fetching,
          loaded = _result7.loaded,
          refetch = _result7.refetch;
      expect(data).toEqual([]);
      expect(error.networkError.message).toBe('lol');
      expect(fetching).toBe(false);
      expect(loaded).toBe(false);
      expect(refetch).toBeInstanceOf(Function);
      done();
    }, 200);
  });
  it('should return mutations when mutations are provided', function (done) {
    global.fetch.mockReturnValue(Promise.resolve({
      data: {
        todos: [{
          id: 1
        }]
      }
    }));
    var clientModule = new ClientModule({
      url: 'test'
    });
    var result; // @ts-ignore

    var client = renderer.create(React.createElement(Client // @ts-ignore
    , {
      client: clientModule // @ts-ignore
      ,
      mutation: {
        test: {
          query: "mutation($text: String!) {\n              addTodo(text: $text) {\n                id\n                text\n              }\n            }",
          variables: {}
        },
        test2: {
          query: "mutation($text: String!) {\n              addTodo2(text: $text) {\n                id\n                text\n              }\n            }",
          variables: {}
        }
      } // @ts-ignore
      ,
      children: function children(args) {
        result = args;
        return null;
      }
    }));
    setTimeout(function () {
      var _result8 = result,
          test = _result8.test,
          test2 = _result8.test2;
      expect(test).toBeTruthy();
      expect(test2).toBeTruthy();
      done();
    }, 200);
  });
  it('should update in response to mutations', function (done) {
    global.fetch.mockReturnValue(Promise.resolve({
      status: 200,
      json: function json() {
        return {
          data: {
            todos: [{
              id: 1,
              __typename: 'Todo'
            }]
          }
        };
      }
    }));
    var clientModule = new ClientModule({
      url: 'test'
    });
    var result; // @ts-ignore

    var spy = jest.spyOn(global, 'fetch'); // @ts-ignore

    var client = renderer.create(React.createElement(Client // @ts-ignore
    , {
      client: clientModule // @ts-ignore
      ,
      query: {
        query: "{ todos { id } }"
      } // @ts-ignore
      ,
      mutation: {
        addTodo: {
          query: "mutation($id: id!) {\n              addTodo(id: $id) {\n                id\n                text\n              }\n            }",
          variables: {
            id: 1
          }
        }
      } // @ts-ignore
      ,
      children: function children(args) {
        result = args;
        return null;
      }
    }));
    setTimeout(function () {
      result.addTodo().then(function () {
        setTimeout(function () {
          var _result9 = result,
              data = _result9.data;
          expect(spy).toHaveBeenCalledTimes(3);
          expect(data).toBeTruthy();
          done();
        }, 200);
      });
    }, 0);
  });
  it('should pass mutation result in Promise', function (done) {
    global.fetch.mockReturnValue(Promise.resolve({
      status: 200,
      json: function json() {
        return {
          data: {
            addTodo: {
              id: '1',
              text: 'TestItem',
              __typename: 'Todo'
            }
          }
        };
      }
    }));
    var clientModule = new ClientModule({
      url: 'test'
    });
    var result; // @ts-ignore

    var client = renderer.create(React.createElement(Client // @ts-ignore
    , {
      client: clientModule // @ts-ignore
      ,
      mutation: {
        addTodo: {
          query: "mutation($id: id!) {\n              addTodo(id: $id) {\n                id\n                text\n              }\n            }",
          variables: {
            id: 1
          }
        }
      } // @ts-ignore
      ,
      children: function children(args) {
        result = args;
        return null;
      }
    }));
    setTimeout(function () {
      result.addTodo().then(function (mutationResult) {
        expect(mutationResult).toEqual({
          addTodo: {
            id: '1',
            text: 'TestItem',
            __typename: 'Todo'
          }
        });
        done();
      });
    }, 0);
  });
  it('should update from cache when called with the refresh option', function (done) {
    global.fetch.mockReturnValue(Promise.resolve({
      data: {
        todos: [{
          id: 1,
          __typename: 'Todo'
        }]
      }
    }));
    var clientModule = new ClientModule({
      url: 'test'
    }); // @ts-ignore

    var spy = jest.spyOn(global, 'fetch'); // @ts-ignore

    var client = renderer.create(React.createElement(Client // @ts-ignore
    , {
      client: clientModule // @ts-ignore
      ,
      query: {
        query: "{ todos { id } }"
      } // @ts-ignore
      ,
      children: function children() {
        return null;
      }
    })); // NOTE: Delay here waits for the fetch to flush and complete, since
    // dedupExchange would deduplicate it otherwise

    setTimeout(function () {
      client.getInstance().update({
        type: ClientEventType.RefreshAll
      });
      setTimeout(function () {
        expect(spy).toHaveBeenCalledTimes(2);
        spy.mockRestore();
        done();
      }, 100);
    }, 100);
  });
  it('should respect the cache prop', function (done) {
    global.fetch.mockReturnValue(Promise.resolve({
      data: {
        todos: [{
          id: 1,
          __typename: 'Todo'
        }]
      }
    }));
    var clientModule = new ClientModule({
      url: 'test'
    }); // @ts-ignore

    var result; // @ts-ignore

    var client = renderer.create(React.createElement(Client // @ts-ignore
    , {
      client: clientModule // @ts-ignore
      ,
      cache: false // @ts-ignore
      ,
      query: {
        query: "{ todos { id } }"
      } // @ts-ignore
      ,
      mutation: {
        addTodo: {
          query: "mutation($id: id!) {\n              addTodo(id: $id) {\n                id\n                text\n              }\n            }",
          variables: {
            id: 1
          }
        }
      } // @ts-ignore
      ,
      children: function children(args) {
        result = args;
        return null;
      }
    })); // NOTE: Delay here waits for the fetch to flush and complete, since
    // dedupExchange would deduplicate it otherwise

    setTimeout(function () {
      client.getInstance().fetch();
      setTimeout(function () {
        expect(global.fetch).toHaveBeenCalledTimes(2);
        done();
      }, 0);
    }, 100);
  });
  it('should use shouldInvalidate if present', function (done) {
    global.fetch.mockReturnValue(Promise.resolve({
      status: 200,
      json: function json() {
        return {
          data: {
            todos: [{
              id: 1,
              __typename: 'Todo'
            }]
          }
        };
      }
    }));
    var clientModule = new ClientModule({
      url: 'test'
    });
    var result; // @ts-ignore

    var client = renderer.create(React.createElement(Client // @ts-ignore
    , {
      client: clientModule // @ts-ignore
      ,
      query: {
        query: "{ todos { id } }"
      } // @ts-ignore
      ,
      shouldInvalidate: function shouldInvalidate() {
        return false;
      } // @ts-ignore
      ,
      mutation: {
        addTodo: {
          query: "mutation($id: id!) {\n              addTodo(id: $id) {\n                id\n                text\n              }\n            }",
          variables: {
            id: 1
          }
        }
      } // @ts-ignore
      ,
      children: function children(args) {
        result = args;
        return null;
      }
    }));
    setTimeout(function () {
      result.addTodo().then(function () {
        setTimeout(function () {
          var _result10 = result,
              data = _result10.data;
          expect(global.fetch).toHaveBeenCalledTimes(2);
          expect(data).toBeTruthy();
          done();
        }, 200);
      });
    }, 0);
  });
  it('should not update in response to mutations that throw', function (done) {
    global.fetch.mockReturnValue(Promise.reject(new Error('Yoinks!')));
    var clientModule = new ClientModule({
      url: 'test'
    });
    var result; // @ts-ignore

    var client = renderer.create(React.createElement(Client // @ts-ignore
    , {
      client: clientModule // @ts-ignore
      ,
      query: {
        query: "{ todos { id } }"
      } // @ts-ignore
      ,
      mutation: {
        addTodo: {
          query: "mutation($id: id!) {\n              addTodo(id: $id) {\n                id\n                text\n              }\n            }",
          variables: {
            id: 1
          }
        }
      } // @ts-ignore
      ,
      children: function children(args) {
        result = args;
        return null;
      }
    }));
    setTimeout(function () {
      result.addTodo().catch(function () {
        expect(global.fetch).toHaveBeenCalledTimes(2);
        done();
      });
    }, 0);
  });
  it('shouldnt return data or mutations if neither is provided', function () {
    var clientModule = new ClientModule({
      url: 'test'
    });
    var result; // @ts-ignore

    var client = renderer.create(React.createElement(Client // @ts-ignore
    , {
      client: clientModule // @ts-ignore
      ,
      children: function children(args) {
        result = args;
        return null;
      }
    }));
    expect(result).toMatchObject({
      loaded: false,
      fetching: false,
      error: null,
      data: null,
      refetch: result.refetch
    });
  });
  it('should hash queries and read from the cache', function () {
    var query = "\n      {\n        todos {\n          id\n          __typename\n        }\n      }\n    ";
    var formatted = formatTypeNames({
      query: query,
      variables: {}
    });
    var hash = hashString(JSON.stringify(formatted));
    var clientModule = new ClientModule({
      url: 'test'
    });
    clientModule.store[hash] = 5; // @ts-ignore

    var client = renderer.create(React.createElement(Client // @ts-ignore
    , {
      client: clientModule // @ts-ignore
      ,
      children: function children() {
        return null;
      }
    }));
    client.getInstance().read({
      query: query,
      variables: {}
    }).then(function (data) {
      expect(data).toBe(5);
    });
  });
  it('should invalidate the entire cache when invalidateAll is called', function () {
    var clientModule = new ClientModule({
      url: 'test',
      initialCache: {
        test: 5
      }
    }); // @ts-ignore

    var client = renderer.create(React.createElement(Client // @ts-ignore
    , {
      client: clientModule // @ts-ignore
      ,
      children: function children() {
        return null;
      }
    }));
    client.getInstance().invalidateAll().then(function () {
      expect(clientModule.store).toMatchObject({});
    });
  });
  it('should invalidate a query when invalidate is called with one', function () {
    var query = "\n      {\n        todos {\n          id\n          __typename\n        }\n      }\n    ";
    var formatted = formatTypeNames({
      query: query,
      variables: {}
    });
    var hash = hashString(JSON.stringify(formatted));
    var clientModule = new ClientModule({
      url: 'test'
    });
    clientModule.store[hash] = 5; // @ts-ignore

    var client = renderer.create(React.createElement(Client // @ts-ignore
    , {
      client: clientModule // @ts-ignore
      ,
      children: function children() {
        return null;
      }
    }));
    client.getInstance().invalidate({
      query: query,
      variables: {}
    }).then(function () {
      expect(clientModule.store).toMatchObject({});
    });
  });
  it('should invalidate component query by default when invalidate is called', function () {
    var query = "\n      {\n        todos {\n          id\n          __typename\n        }\n      }\n    ";
    global.fetch.mockReturnValueOnce(Promise.resolve({
      data: {
        todos: [{
          id: 1,
          __typename: 'Todo'
        }]
      }
    }));
    var clientModule = new ClientModule({
      url: 'test'
    }); // @ts-ignore

    var client = renderer.create(React.createElement(Client // @ts-ignore
    , {
      query: {
        query: query,
        variables: {}
      } // @ts-ignore
      ,
      client: clientModule // @ts-ignore
      ,
      children: function children() {
        return null;
      }
    }));
    client.getInstance().invalidate().then(function () {
      expect(clientModule.store).toMatchObject({});
    });
  });
  it('should invalidate component queries by default when invalidate is called', function () {
    var query = "\n      {\n        todos {\n          id\n          __typename\n        }\n      }\n    ";
    global.fetch.mockReturnValue(Promise.resolve({
      status: 200,
      data: {
        todos: [{
          id: 1,
          __typename: 'Todo'
        }]
      }
    }));
    var clientModule = new ClientModule({
      url: 'test'
    }); // @ts-ignore

    var client = renderer.create(React.createElement(Client // @ts-ignore
    , {
      query: [{
        query: query,
        variables: {}
      }, {
        query: query,
        variables: {}
      }] // @ts-ignore
      ,
      client: clientModule // @ts-ignore
      ,
      children: function children() {
        return null;
      }
    }));
    return client.getInstance().invalidate().then(function () {
      expect(clientModule.store).toMatchObject({});
    });
  });
  it('should update cache when updateCache is called', function () {
    var clientModule = new ClientModule({
      url: 'test',
      initialCache: {
        test: 5
      }
    }); // @ts-ignore

    var client = renderer.create(React.createElement(Client // @ts-ignore
    , {
      client: clientModule // @ts-ignore
      ,
      children: function children() {
        return null;
      }
    }));
    return client.getInstance().updateCache(function (store, key) {
      if (key === 'test') {
        store[key] = 6;
      }
    }).then(function () {
      expect(clientModule.store).toMatchObject({
        test: 6
      });
    });
  });
  it('should trigger a refresh when refreshAllFromCache is called', function () {
    var clientModule = new ClientModule({
      url: 'test'
    }); // @ts-ignore

    var client = renderer.create(React.createElement(Client // @ts-ignore
    , {
      client: clientModule // @ts-ignore
      ,
      children: function children() {
        return null;
      }
    }));
    var spy = jest.spyOn(clientModule, 'refreshAllFromCache');
    return client.getInstance().refreshAllFromCache().then(function () {
      expect(spy).toHaveBeenCalled();
    });
  });
  it('should handle subscriptions and return the proper render prop arguments', function () {
    var unsubscribe = jest.fn();
    var observer;

    var createSubscription = function createSubscription(_, _observer) {
      observer = _observer;
      return {
        unsubscribe: unsubscribe
      };
    };

    var clientModule = new ClientModule({
      url: 'test',
      transformExchange: function transformExchange(x) {
        return subscriptionExchange(createSubscription, x);
      }
    });
    var result; // @ts-ignore

    var client = renderer.create(React.createElement(Client, {
      client: clientModule,
      subscription: {
        query: "subscription { todos { id } }"
      },
      children: function children(args) {
        result = args;
        return null;
      }
    }));
    expect(result.data).toBe(null);
    expect(result.error).toBe(null);
    expect(result.loaded).toBe(false);
    observer.next({
      data: 'test1'
    });
    expect(result.data).toBe('test1');
    expect(result.loaded).toBe(true);
    observer.next({
      data: 'test2'
    });
    expect(result.data).toBe('test2');
    observer.next({
      errors: ['testerr']
    });
    expect(result.data).toBe(null);
    expect(result.error).toEqual(new CombinedError({
      graphQLErrors: ['testerr']
    }));
    observer.error(new Error('uhnuuuu'));
    expect(result.fetching).toBe(false);
    expect(result.error).toEqual(new CombinedError({
      networkError: new Error('uhnuuuu')
    }));
  });
  it('should not accept query and subscription props at the same time', function () {
    expect(function () {
      var p = {
        query: {
          query: "{ todos { id } }"
        },
        subscription: {
          query: "subscription { todos { id } }"
        }
      }; // @ts-ignore

      var c = new Client(p);
      c.formatProps(p);
    }).toThrowErrorMatchingSnapshot();
  });
  it('should handle subscription, query, and updateSubscription props', function (done) {
    var data = {
      todos: [{
        id: 1,
        __typename: 'Todo'
      }]
    };
    global.fetch.mockReturnValue(Promise.resolve({
      status: 200,
      json: function json() {
        return {
          data: data
        };
      }
    }));
    var unsubscribe = jest.fn();
    var observer;

    var createSubscription = function createSubscription(_, _observer) {
      observer = _observer;
      return {
        unsubscribe: unsubscribe
      };
    };

    var clientModule = new ClientModule({
      url: 'test',
      transformExchange: function transformExchange(x) {
        return subscriptionExchange(createSubscription, x);
      }
    });
    var query = "{ todos { id } }";

    var updateSubscription = function updateSubscription(_, next) {
      return next;
    };

    var result; // @ts-ignore

    var client = renderer.create(React.createElement(Client, {
      client: clientModule,
      query: {
        query: query
      },
      subscription: {
        query: "subscription { todos { id } }"
      },
      updateSubscription: updateSubscription,
      children: function children(args) {
        result = args;
        return null;
      }
    }));
    expect(result.data).toBe(null);
    expect(result.error).toBe(null);
    expect(result.loaded).toBe(false);
    expect(Object.keys(clientModule.store).length).toBe(0);
    setTimeout(function () {
      expect(result.data).toBe(data);
      expect(result.loaded).toBe(true);
      expect(Object.keys(clientModule.store).length).toBe(1);
      var newData = {
        test: 'test1'
      };
      observer.next({
        data: newData
      });
      expect(result.data).toBe(newData);
      expect(Object.keys(clientModule.store).length).toBe(0);
      done();
    }, 100);
  });
  it('should handle subscription, query array, and updateSubscription props', function (done) {
    var data = {
      todos: [{
        id: 1,
        __typename: 'Todo'
      }]
    };
    global.fetch.mockReturnValue(Promise.resolve({
      status: 200,
      json: function json() {
        return {
          data: data
        };
      }
    }));
    var unsubscribe = jest.fn();
    var observer;

    var createSubscription = function createSubscription(_, _observer) {
      observer = _observer;
      return {
        unsubscribe: unsubscribe
      };
    };

    var clientModule = new ClientModule({
      url: 'test',
      transformExchange: function transformExchange(x) {
        return subscriptionExchange(createSubscription, x);
      }
    });
    var query = "{ todos { id } }";

    var updateSubscription = function updateSubscription(_, next) {
      return next;
    };

    var result; // @ts-ignore

    var client = renderer.create(React.createElement(Client, {
      client: clientModule,
      query: [{
        query: query
      }, {
        query: query
      }],
      subscription: {
        query: "subscription { todos { id } }"
      },
      updateSubscription: updateSubscription,
      children: function children(args) {
        result = args;
        return null;
      }
    }));
    expect(result.data).toBe(null);
    expect(result.error).toBe(null);
    expect(result.loaded).toBe(false);
    expect(Object.keys(clientModule.store).length).toBe(0);
    setTimeout(function () {
      expect(result.data).toEqual([data, data]);
      expect(result.loaded).toBe(true);
      expect(Object.keys(clientModule.store).length).toBe(1);
      var newData = {
        test: 'test1'
      };
      observer.next({
        data: newData
      });
      expect(result.data).toBe(newData);
      expect(Object.keys(clientModule.store).length).toBe(0);
      done();
    }, 100);
  });
  it('should unsubscribe before starting a new query', function () {
    global.fetch.mockReturnValue(new Promise(function () {}));
    var clientModule = new ClientModule({
      url: 'test'
    });
    var query = "{ todos { id } }"; // @ts-ignore

    var client = renderer.create(React.createElement(Client, {
      client: clientModule,
      query: {
        query: query
      },
      children: function children() {
        return null;
      }
    }));
    expect(client.getInstance().querySub).not.toBeNull();
    var spy = jest.spyOn(client.getInstance().querySub, 'unsubscribe'); // Manually trigger fetch

    client.getInstance().fetch();
    expect(spy).toHaveBeenCalledTimes(1);
  });
  it('should unsubscribe before starting a new subscription', function () {
    var createSubscription = function createSubscription(_, _observer) {
      return {
        unsubscribe: function unsubscribe() {}
      };
    };

    var clientModule = new ClientModule({
      url: 'test',
      transformExchange: function transformExchange(x) {
        return subscriptionExchange(createSubscription, x);
      }
    }); // @ts-ignore

    var client = renderer.create(React.createElement(Client, {
      client: clientModule,
      subscription: {
        query: "subscription { ideas { id } }"
      },
      children: function children() {
        return null;
      }
    }));
    expect(client.getInstance().subscriptionSub).not.toBeNull();
    var spy = jest.spyOn(client.getInstance().subscriptionSub, 'unsubscribe'); // Manually trigger fetch

    client.getInstance().subscribeToQuery();
    expect(spy).toHaveBeenCalledTimes(1);
  });
});