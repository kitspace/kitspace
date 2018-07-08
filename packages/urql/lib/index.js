"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
var _exportNames = {
  Client: true,
  Provider: true,
  Connect: true,
  ConnectHOC: true,
  formatTypeNames: true
};
Object.defineProperty(exports, "Client", {
  enumerable: true,
  get: function get() {
    return _client.default;
  }
});
Object.defineProperty(exports, "Provider", {
  enumerable: true,
  get: function get() {
    return _provider.default;
  }
});
Object.defineProperty(exports, "Connect", {
  enumerable: true,
  get: function get() {
    return _connect.default;
  }
});
Object.defineProperty(exports, "ConnectHOC", {
  enumerable: true,
  get: function get() {
    return _connectHoc.default;
  }
});
Object.defineProperty(exports, "formatTypeNames", {
  enumerable: true,
  get: function get() {
    return _typenames.formatTypeNames;
  }
});

var _client = _interopRequireDefault(require("./modules/client"));

Object.keys(_client).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return _client[key];
    }
  });
});

var _provider = _interopRequireDefault(require("./components/provider"));

Object.keys(_provider).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return _provider[key];
    }
  });
});

var _connect = _interopRequireDefault(require("./components/connect"));

Object.keys(_connect).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return _connect[key];
    }
  });
});

var _connectHoc = _interopRequireDefault(require("./components/connect-hoc"));

Object.keys(_connectHoc).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return _connectHoc[key];
    }
  });
});

var _query = require("./modules/query");

Object.keys(_query).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return _query[key];
    }
  });
});

var _cacheExchange = require("./modules/cache-exchange");

Object.keys(_cacheExchange).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return _cacheExchange[key];
    }
  });
});

var _dedupExchange = require("./modules/dedup-exchange");

Object.keys(_dedupExchange).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return _dedupExchange[key];
    }
  });
});

var _error = require("./modules/error");

Object.keys(_error).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return _error[key];
    }
  });
});

var _httpExchange = require("./modules/http-exchange");

Object.keys(_httpExchange).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return _httpExchange[key];
    }
  });
});

var _subscriptionExchange = require("./modules/subscription-exchange");

Object.keys(_subscriptionExchange).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return _subscriptionExchange[key];
    }
  });
});

var _typenames = require("./modules/typenames");

var _index = require("./interfaces/index");

Object.keys(_index).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return _index[key];
    }
  });
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }