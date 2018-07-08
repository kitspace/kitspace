"use strict";

var _defaultCache = require("../../modules/default-cache");

describe('defaultCache', function () {
  beforeEach(function () {
    jest.resetAllMocks();
    jest.clearAllMocks();
    jest.restoreAllMocks();
  });
  it('should provide a valid cache by default', function (done) {
    var store = {
      test: 5
    };
    var cache = (0, _defaultCache.defaultCache)(store);
    Promise.all([cache.invalidateAll(), cache.read('test'), cache.write('test', 5), cache.read('test'), cache.update(function (acc, key) {
      if (key === 'test') {
        acc[key] = 6;
      }
    }), cache.update(null), cache.read('test'), cache.invalidate('test'), cache.read('test')]).then(function (d) {
      expect(d).toEqual([undefined, null, 'test', 5, undefined, undefined, 6, 'test', null]);
      done();
    });
  });
});