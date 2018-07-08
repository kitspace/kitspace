"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.subscription = exports.mutation = exports.query = void 0;

var createQuery = function createQuery(q, vars) {
  return {
    query: q,
    variables: vars || {}
  };
};

var query = createQuery;
exports.query = query;
var mutation = createQuery;
exports.mutation = mutation;
var subscription = createQuery;
exports.subscription = subscription;