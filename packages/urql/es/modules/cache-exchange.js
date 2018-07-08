function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

import Observable from 'zen-observable-ts';
import { gankTypeNamesFromResponse } from "./typenames";
// Wraps an exchange and refers/updates the cache according to operations
export var cacheExchange = function cacheExchange(cache, forward) {
  var typenameInvalidate = {};
  return function (operation) {
    var operationName = operation.operationName,
        key = operation.key;
    var withTypenames$ = forward(operation).map(function (response) {
      // Grab typenames from response data
      var typeNames = gankTypeNamesFromResponse(response.data); // For mutations, invalidate the cache early so that unmounted Client components don't mount with
      // stale, cached responses

      if (operationName === 'mutation') {
        typeNames.forEach(function (typename) {
          var cacheKeys = typenameInvalidate[typename];
          typenameInvalidate[typename] = [];

          if (cacheKeys !== undefined) {
            cacheKeys.forEach(function (cacheKey) {
              cache.invalidate(cacheKey);
            });
          }
        });
      }

      return _extends({}, response, {
        typeNames: typeNames
      });
    });
    var context = operation.context;

    if (operationName !== 'query') {
      return withTypenames$;
    }

    var _context$skipCache = context.skipCache,
        skipCache = _context$skipCache === void 0 ? false : _context$skipCache;
    return new Observable(function (observer) {
      var subscription;
      cache.read(key).then(function (cachedResult) {
        if (cachedResult && !skipCache) {
          observer.next(cachedResult);
          observer.complete();
          return;
        }

        subscription = withTypenames$.subscribe({
          complete: function complete() {
            return observer.complete();
          },
          error: function error(err) {
            return observer.error(err);
          },
          next: function next(response) {
            // Mark typenames on typenameInvalidate for early invalidation
            response.typeNames.forEach(function (typename) {
              var cacheKeys = typenameInvalidate[typename] || (typenameInvalidate[typename] = []);
              cacheKeys.push(key);
            }); // Store data in cache, using serialized query as key

            cache.write(key, response); // Return response with typeNames

            observer.next(response);
          }
        });
      });
      return function () {
        if (subscription) {
          subscription.unsubscribe();
        }
      };
    });
  };
};