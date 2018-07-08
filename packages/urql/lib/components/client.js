"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = require("react");

var _hash = require("../modules/hash");

var _typenames = require("../modules/typenames");

var _zipObservables = require("../utils/zip-observables");

var _index = require("../interfaces/index");

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

function _inheritsLoose(subClass, superClass) { subClass.prototype = Object.create(superClass.prototype); subClass.prototype.constructor = subClass; subClass.__proto__ = superClass; }

var UrqlClient =
/*#__PURE__*/
function (_Component) {
  _inheritsLoose(UrqlClient, _Component);

  function UrqlClient() {
    var _this;

    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    _this = _Component.call.apply(_Component, [this].concat(args)) || this;
    _this.state = {
      data: null,
      error: null,
      fetching: false,
      loaded: false
    };
    _this.willUpdateSubscription = false;
    _this.subscription = null;
    _this.query = null;
    _this.mutations = {};
    _this.typeNames = [];
    _this.unsubscribe = null;
    _this.subscriptionSub = null;
    _this.querySub = null;

    _this.invalidate = function (queryObject) {
      var cache = _this.props.client.cache;

      if (queryObject) {
        var stringified = JSON.stringify((0, _typenames.formatTypeNames)(queryObject));
        var hash = (0, _hash.hashString)(stringified);
        return cache.invalidate(hash);
      } else {
        return Array.isArray(_this.props.query) ? Promise.all(_this.props.query.map(function (q) {
          return cache.invalidate((0, _hash.hashString)(JSON.stringify(q)));
        })) : cache.invalidate((0, _hash.hashString)(JSON.stringify(_this.query)));
      }
    };

    _this.invalidateAll = function () {
      return _this.props.client.cache.invalidateAll();
    };

    _this.read = function (query) {
      var formatted = (0, _typenames.formatTypeNames)(query);
      var stringified = JSON.stringify(formatted);
      var hash = (0, _hash.hashString)(stringified);
      return _this.props.client.cache.read(hash);
    };

    _this.updateCache = function (callback) {
      return _this.props.client.cache.update(callback);
    };

    _this.formatProps = function (props) {
      if (props.subscription && props.query && !props.updateSubscription) {
        throw new Error('Passing a query and a subscription prop at the same time without an updateSubscription function is invalid.');
      }

      _this.willUpdateSubscription = props.subscription && props.query && props.updateSubscription; // If query exists

      if (props.query) {
        // Loop through and add typenames
        _this.query = Array.isArray(props.query) ? props.query.map(_typenames.formatTypeNames) : (0, _typenames.formatTypeNames)(props.query); // Subscribe to change listener

        _this.unsubscribe = props.client.subscribe(_this.update); // Fetch initial data

        _this.fetch(undefined, true);
      } // If subscription exists


      if (props.subscription) {
        // Loop through and add typenames
        _this.subscription = (0, _typenames.formatTypeNames)(props.subscription); // Fetch initial data

        _this.subscribeToQuery();
      } // If mutation exists and has keys


      if (props.mutation) {
        _this.mutations = {}; // Loop through and add typenames

        Object.keys(props.mutation).forEach(function (key) {
          _this.mutations[key] = (0, _typenames.formatTypeNames)(props.mutation[key]);
        }); // bind to mutate

        Object.keys(_this.mutations).forEach(function (m) {
          var query = _this.mutations[m].query;

          _this.mutations[m] = function (variables) {
            return _this.mutate({
              query: query,
              variables: _extends({}, _this.mutations[m].variables, variables)
            });
          };

          if (!_this.props.query) {
            _this.forceUpdate();
          }
        });
      }
    };

    _this.update = function (event) {
      var type = event.type;

      if (type === _index.ClientEventType.RefreshAll) {
        // RefreshAll indicates that the component should refetch its queries
        _this.fetch();

        return;
      } else if (type === _index.ClientEventType.InvalidateTypenames) {
        // InvalidateTypenames instructs us to reevaluate this component's typenames
        var _event$payload = event.payload,
            typenames = _event$payload.typenames,
            changes = _event$payload.changes;
        var invalidated = false;

        if (_this.props.shouldInvalidate) {
          invalidated = _this.props.shouldInvalidate(typenames, _this.typeNames, changes, _this.state.data);
        } else if (_this.props.typeInvalidation !== false) {
          // Check connection typenames, derived from query, for presence of mutated typenames
          invalidated = _this.typeNames.some(function (typeName) {
            return typenames.indexOf(typeName) !== -1;
          });
        } // If it has any of the type names that changed


        if (invalidated) {
          // Refetch the data from the server
          _this.fetch({
            skipCache: true
          });
        }
      }
    };

    _this.refreshAllFromCache = function () {
      return _this.props.client.refreshAllFromCache();
    };

    _this.fetch = function (opts, initial) {
      if (opts === void 0) {
        opts = {
          skipCache: false
        };
      }

      var client = _this.props.client;
      var _opts = opts,
          skipCache = _opts.skipCache;

      if (_this.props.cache === false) {
        skipCache = true;
      }

      if (_this.querySub !== null) {
        _this.querySub.unsubscribe();

        _this.querySub = null;
      } // Start loading state


      _this.setState({
        error: null,
        fetching: true
      }); // If query is not an array


      if (!Array.isArray(_this.query)) {
        // Fetch the query
        _this.querySub = client.executeQuery$(_this.query, skipCache).subscribe({
          complete: function complete() {
            _this.querySub = null;
          },
          error: function error(e) {
            _this.querySub = null;

            _this.setState({
              error: e,
              fetching: false
            });
          },
          next: function next(result) {
            // Store the typenames
            _this.typeNames = result.typeNames; // Update data

            _this.setState({
              data: result.data || null,
              error: result.error,
              fetching: false,
              loaded: initial ? true : _this.state.loaded
            });
          }
        });
      } else {
        var partialData = [];

        var queries$ = _this.query.map(function (query) {
          return client.executeQuery$(query, skipCache).map(function (result) {
            // Accumulate and deduplicate all typeNames
            result.typeNames.forEach(function (typeName) {
              if (_this.typeNames.indexOf(typeName) === -1) {
                _this.typeNames.push(typeName);
              }
            }); // Push to partial data and return same result

            partialData.push(result);
            return result;
          });
        });

        _this.querySub = (0, _zipObservables.zipObservables)(queries$).subscribe({
          error: function error(e) {
            _this.setState({
              data: partialData.map(function (part) {
                return part.data;
              }),
              error: e,
              fetching: false
            });
          },
          next: function next(results) {
            var errors = results.map(function (res) {
              return res.error;
            }).filter(Boolean);

            _this.setState({
              data: results.map(function (res) {
                return res.data;
              }),
              error: errors.length > 0 ? errors : null,
              fetching: false,
              loaded: true
            });
          }
        });
      }
    };

    _this.subscribeToQuery = function () {
      var _this$props = _this.props,
          client = _this$props.client,
          updateSubscription = _this$props.updateSubscription;

      if (_this.subscriptionSub !== null) {
        _this.subscriptionSub.unsubscribe();

        _this.subscriptionSub = null;
      }

      if (!_this.willUpdateSubscription) {
        // Start loading state
        _this.setState({
          error: null,
          fetching: true
        });
      } // Fetch the query


      _this.subscriptionSub = client.executeSubscription$(_this.subscription).subscribe({
        complete: function complete() {
          _this.subscriptionSub = null;
        },
        error: function error(e) {
          _this.subscriptionSub = null;

          _this.setState({
            error: e,
            fetching: false
          });
        },
        next: function next(result) {
          var nextData = result.data || null; // Update data

          _this.setState(function (state) {
            return {
              data: _this.willUpdateSubscription ? updateSubscription(state.data || null, nextData) : nextData,
              error: result.error,
              fetching: false,
              loaded: true
            };
          }, function () {
            var invalidate = _this.willUpdateSubscription && _this.query && _this.props.typeInvalidation !== false;

            if (invalidate && Array.isArray(_this.query)) {
              _this.query.forEach(function (query) {
                client.invalidateQuery(query);
              });
            } else if (invalidate) {
              client.invalidateQuery(_this.query);
            }
          });
        }
      });
    };

    _this.mutate = function (mutation) {
      var client = _this.props.client; // Set fetching state

      _this.setState({
        error: null,
        fetching: true
      });

      return new Promise(function (resolve, reject) {
        // Execute mutation
        client.executeMutation$(mutation).subscribe({
          error: function error(e) {
            _this.setState({
              error: e,
              fetching: false
            }, function () {
              reject(e);
            });
          },
          next: function next(result) {
            _this.setState({
              fetching: false
            }, function () {
              resolve(result);
            });
          }
        });
      });
    };

    return _this;
  }

  var _proto = UrqlClient.prototype;

  // Subscription for ongoing queries
  _proto.componentDidMount = function componentDidMount() {
    this.formatProps(this.props);
  };

  _proto.componentDidUpdate = function componentDidUpdate(prevProps) {
    var nextProps = this.props;

    if (prevProps.query !== nextProps.query || prevProps.mutation !== nextProps.mutation) {
      this.formatProps(nextProps);
    }
  };

  _proto.componentWillUnmount = function componentWillUnmount() {
    // Unsub from change listener
    if (this.unsubscribe !== null) {
      this.unsubscribe();
    }

    if (this.subscriptionSub !== null) {
      this.subscriptionSub.unsubscribe();
    }

    if (this.querySub !== null) {
      this.querySub.unsubscribe();
    }
  };

  _proto.render = function render() {
    var cache = {
      invalidate: this.invalidate,
      invalidateAll: this.invalidateAll,
      read: this.read,
      update: this.updateCache
    };
    return typeof this.props.children === 'function' ? this.props.children(_extends({}, this.state, this.mutations, {
      cache: cache,
      client: this.props.client,
      refetch: this.fetch,
      refreshAllFromCache: this.refreshAllFromCache
    })) : null;
  };

  return UrqlClient;
}(_react.Component);

exports.default = UrqlClient;
UrqlClient.defaultProps = {
  cache: true,
  typeInvalidation: true
};