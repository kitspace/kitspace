"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) if (e.indexOf(p[i]) < 0)
            t[p[i]] = s[p[i]];
    return t;
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
var React = __importStar(require("react"));
var react_router_dom_1 = require("react-router-dom");
var loadInitialProps_1 = require("./loadInitialProps");
var Afterparty = /** @class */ (function (_super) {
    __extends(Afterparty, _super);
    function Afterparty(props) {
        var _this = _super.call(this, props) || this;
        _this.prefetch = function (pathname) {
            loadInitialProps_1.loadInitialProps(_this.props.routes, pathname, {
                history: _this.props.history,
            })
                .then(function (_a) {
                var data = _a.data;
                var _b;
                _this.prefetcherCache = Object.assign({}, _this.prefetcherCache, (_b = {},
                    _b[pathname] = data,
                    _b));
            })
                .catch(function (e) { return console.log(e); });
        };
        _this.state = {
            data: props.data,
            previousLocation: null,
        };
        _this.prefetcherCache = {};
        return _this;
    }
    // only runs clizzient
    Afterparty.prototype.componentWillReceiveProps = function (nextProps, nextState) {
        var _this = this;
        var navigated = nextProps.location !== this.props.location;
        if (navigated) {
            window.scrollTo(0, 0);
            // save the location so we can render the old screen
            this.setState({
                previousLocation: this.props.location,
                data: undefined,
            });
            var data = nextProps.data, match = nextProps.match, routes = nextProps.routes, history_1 = nextProps.history, location_1 = nextProps.location, rest = __rest(nextProps, ["data", "match", "routes", "history", "location"]);
            loadInitialProps_1.loadInitialProps(this.props.routes, nextProps.location.pathname, __assign({ location: nextProps.location, history: nextProps.history }, rest))
                .then(function (_a) {
                var data = _a.data;
                _this.setState({ previousLocation: null, data: data });
            })
                .catch(function (e) {
                // @todo we should more cleverly handle errors???
                console.log(e);
            });
        }
    };
    Afterparty.prototype.render = function () {
        var _this = this;
        var _a = this.state, previousLocation = _a.previousLocation, data = _a.data;
        var location = this.props.location;
        var initialData = this.prefetcherCache[location.pathname] || data;
        return (React.createElement(react_router_dom_1.Switch, null, this.props.routes.map(function (r, i) { return (React.createElement(react_router_dom_1.Route, { key: "route--" + i, path: r.path, exact: r.exact, location: previousLocation || location, render: function (props) {
                return React.createElement(r.component, __assign({}, initialData, { history: props.history, location: previousLocation || location, match: props.match, prefetch: _this.prefetch }));
            } })); })));
    };
    return Afterparty;
}(React.Component));
exports.After = react_router_dom_1.withRouter(Afterparty);
//# sourceMappingURL=After.js.map