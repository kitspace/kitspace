"use strict";

var _hash = require("../../modules/hash");

describe('hash', function () {
  it('should returned a murmur hashed string from a query string', function () {
    var hash = (0, _hash.hashString)("{ todos { id } }");
    expect(hash).toBe('1rvkz44');
  });
});