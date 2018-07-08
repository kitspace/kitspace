"use strict";

var _zenObservableTs = _interopRequireDefault(require("zen-observable-ts"));

var _cacheExchange = require("../../modules/cache-exchange");

var _defaultCache3 = require("../../modules/default-cache");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

var result = {
  data: {
    item: {
      __typename: 'Item',
      id: 'item'
    }
  }
};
describe('cacheExchange', function () {
  beforeEach(function () {
    jest.resetAllMocks();
    jest.clearAllMocks();
    jest.restoreAllMocks();
  });
  it('attaches typeNames to a result', function (done) {
    var cache = (0, _defaultCache3.defaultCache)({});

    var forward = function forward() {
      return _zenObservableTs.default.of(result);
    };

    var exchange = (0, _cacheExchange.cacheExchange)(cache, forward);
    var operation = {
      operationName: 'x'
    };
    exchange(operation).subscribe(function (res) {
      expect(res.typeNames).toEqual(['Item']);
      expect(res.data).toEqual(result.data);
      done();
    });
  });
  it('reads a query result from the passed cache first', function (done) {
    var _defaultCache;

    var testkey = 'TESTKEY';
    var cache = (0, _defaultCache3.defaultCache)((_defaultCache = {}, _defaultCache[testkey] = result, _defaultCache));

    var forward = function forward() {
      return _zenObservableTs.default.of(undefined);
    };

    var exchange = (0, _cacheExchange.cacheExchange)(cache, forward);
    var operation = {
      context: {},
      key: testkey,
      operationName: 'query'
    };
    exchange(operation).subscribe(function (res) {
      expect(res).toBe(result);
      done();
    });
  });
  it('skips the cache when skipCache is set on context', function (done) {
    var _defaultCache2;

    var testkey = 'TESTKEY';

    var newResult = _extends({}, result, {
      test: true
    });

    var cache = (0, _defaultCache3.defaultCache)((_defaultCache2 = {}, _defaultCache2[testkey] = result, _defaultCache2));

    var forward = function forward() {
      return _zenObservableTs.default.of(newResult);
    };

    var exchange = (0, _cacheExchange.cacheExchange)(cache, forward);
    var operation = {
      context: {
        skipCache: true
      },
      key: testkey,
      operationName: 'query'
    };
    exchange(operation).subscribe(function (res) {
      expect(res.test).toBe(true);
      expect(res.typeNames).toEqual(['Item']);
      done();
    });
  });
  it('writes query results to the cache', function (done) {
    var testkey = 'TESTKEY';
    var store = {};
    var cache = (0, _defaultCache3.defaultCache)(store);

    var forward = function forward() {
      return _zenObservableTs.default.of(result);
    };

    var exchange = (0, _cacheExchange.cacheExchange)(cache, forward);
    var operation = {
      context: {},
      key: testkey,
      operationName: 'query'
    };
    expect(store[testkey]).toBeUndefined();
    exchange(operation).subscribe(function (res) {
      expect(res.data).toEqual(result.data);
      expect(store[testkey]).not.toBeUndefined();
      expect(store[testkey].data).toEqual(result.data);
      done();
    });
  });
  it('records typename invalidations and invalidates parts of the cache when a mutation comes in', function (done) {
    var testkey = 'TESTKEY';
    var store = {
      unrelated: true
    };
    var cache = (0, _defaultCache3.defaultCache)(store);

    var forward = function forward() {
      return _zenObservableTs.default.of(result);
    };

    var exchange = (0, _cacheExchange.cacheExchange)(cache, forward);
    var operationA = {
      context: {},
      key: testkey,
      operationName: 'query'
    };
    var operationB = {
      context: {},
      key: 'anything',
      operationName: 'mutation'
    };
    exchange(operationA).subscribe(function (res) {
      expect(store[testkey]).toBe(res);
      expect(store.unrelated).toBe(true);
      exchange(operationB).subscribe(function () {
        // Disappears due to typename
        expect(store[testkey]).toBeUndefined(); // Remains untouched

        expect(store.unrelated).toBe(true);
        done();
      });
    });
  });
});