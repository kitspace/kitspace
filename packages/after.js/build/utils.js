"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/** @private is the given object a Function? */
exports.isFunction = function (obj) { return 'function' === typeof obj; };
/** @private is the given object an Object? */
exports.isObject = function (obj) { return obj !== null && typeof obj === 'object'; };
/** @private is the given object/value a promise? */
exports.isPromise = function (value) {
    return exports.isObject(value) && exports.isFunction(value.then);
};
//# sourceMappingURL=utils.js.map