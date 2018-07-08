import { ClientEventType } from "../interfaces/index";
import { cacheExchange } from "./cache-exchange";
import { dedupExchange } from "./dedup-exchange";
import { defaultCache } from "./default-cache";
import { hashString } from "./hash";
import { httpExchange } from "./http-exchange";

var Client =
/*#__PURE__*/
function () {
  // Internal store
  // Used to generate IDs for subscriptions
  // Cache object
  // Exchange to communicate with GraphQL APIs
  // Options for fetch call
  // Map of subscribed Connect components
  function Client(opts) {
    this.url = void 0;
    this.store = void 0;
    this.subscriptionSize = void 0;
    this.cache = void 0;
    this.exchange = void 0;
    this.fetchOptions = void 0;
    this.subscriptions = void 0;

    if (!opts) {
      throw new Error('Please provide configuration object');
    } else if (!opts.url) {
      throw new Error('Please provide a URL for your GraphQL API');
    }

    this.url = opts.url;
    this.store = opts.initialCache || {};
    this.subscriptions = Object.create(null);
    this.subscriptionSize = 0;
    this.cache = opts.cache || defaultCache(this.store);
    this.fetchOptions = opts.fetchOptions || {};
    var exchange = cacheExchange(this.cache, dedupExchange(httpExchange()));
    this.exchange = opts.transformExchange ? opts.transformExchange(exchange, this) : exchange; // Bind methods

    this.executeQuery = this.executeQuery.bind(this);
    this.executeMutation = this.executeMutation.bind(this);
    this.invalidateQuery = this.invalidateQuery.bind(this);
    this.updateSubscribers = this.updateSubscribers.bind(this);
    this.refreshAllFromCache = this.refreshAllFromCache.bind(this);
  }

  var _proto = Client.prototype;

  _proto.updateSubscribers = function updateSubscribers(typenames, changes) {
    // On mutation, call subscribed callbacks with eligible typenames

    /* tslint:disable-next-line forin */
    for (var sub in this.subscriptions) {
      this.subscriptions[sub]({
        payload: {
          typenames: typenames,
          changes: changes
        },
        type: ClientEventType.InvalidateTypenames
      });
    }
  };

  _proto.subscribe = function subscribe(callback) {
    var _this = this;

    // Create an identifier, add callback to subscriptions
    var id = this.subscriptionSize++;
    this.subscriptions[id] = callback; // Return unsubscription function

    return function () {
      delete _this.subscriptions[id];
    };
  };

  _proto.refreshAllFromCache = function refreshAllFromCache() {
    var _this2 = this;

    // On mutation, call subscribed callbacks with eligible typenames
    return new Promise(function (resolve) {
      /* tslint:disable-next-line forin */
      for (var sub in _this2.subscriptions) {
        _this2.subscriptions[sub]({
          type: ClientEventType.RefreshAll
        });
      }

      resolve();
    });
  };

  _proto.makeContext = function makeContext(_ref) {
    var skipCache = _ref.skipCache;
    return {
      fetchOptions: typeof this.fetchOptions === 'function' ? this.fetchOptions() : this.fetchOptions,
      skipCache: !!skipCache,
      url: this.url
    };
  };

  _proto.executeSubscription$ = function executeSubscription$(subscriptionObject) {
    // Create hash key for unique query/variables
    var query = subscriptionObject.query,
        variables = subscriptionObject.variables;
    var key = hashString(JSON.stringify({
      query: query,
      variables: variables
    }));
    var operation = {
      context: this.makeContext({}),
      key: key,
      operationName: 'subscription',
      query: query,
      variables: variables
    };
    return this.exchange(operation);
  };

  _proto.executeQuery$ = function executeQuery$(queryObject, skipCache) {
    // Create hash key for unique query/variables
    var query = queryObject.query,
        variables = queryObject.variables;
    var key = hashString(JSON.stringify({
      query: query,
      variables: variables
    }));
    var operation = {
      context: this.makeContext({
        skipCache: skipCache
      }),
      key: key,
      operationName: 'query',
      query: query,
      variables: variables
    };
    return this.exchange(operation);
  };

  _proto.executeQuery = function executeQuery(queryObject, skipCache) {
    var _this3 = this;

    return new Promise(function (resolve, reject) {
      _this3.executeQuery$(queryObject, skipCache).subscribe({
        error: reject,
        next: resolve
      });
    });
  };

  _proto.executeMutation$ = function executeMutation$(mutationObject) {
    var _this4 = this;

    // Create hash key for unique query/variables
    var query = mutationObject.query,
        variables = mutationObject.variables;
    var key = hashString(JSON.stringify({
      query: query,
      variables: variables
    }));
    var operation = {
      context: this.makeContext({}),
      key: key,
      operationName: 'mutation',
      query: query,
      variables: variables
    };
    return this.exchange(operation).map(function (response) {
      // Notify subscribed Connect wrappers
      _this4.updateSubscribers(response.typeNames, response); // Resolve result


      return response.data;
    });
  };

  _proto.executeMutation = function executeMutation(mutationObject) {
    var _this5 = this;

    return new Promise(function (resolve, reject) {
      _this5.executeMutation$(mutationObject).subscribe({
        error: reject,
        next: resolve
      });
    });
  };

  _proto.invalidateQuery = function invalidateQuery(queryObject) {
    var query = queryObject.query,
        variables = queryObject.variables;
    var key = hashString(JSON.stringify({
      query: query,
      variables: variables
    }));
    return this.cache.invalidate(key);
  };

  return Client;
}();

export { Client as default };