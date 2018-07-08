var generateErrorMessage = function generateErrorMessage(networkErr, graphQlErrs) {
  var error = '';

  if (networkErr) {
    error = "[Network] " + networkErr.message;
    return error;
  }

  graphQlErrs.forEach(function (err) {
    error += "[GraphQL] " + err.message + "\n";
  });
  return error.trim();
};

var rehydrateGraphQlError = function rehydrateGraphQlError(error) {
  if (typeof error === 'string') {
    return new Error(error);
  } else if (error.message) {
    return new Error(error.message);
  } else {
    return error;
  }
}; // Shared interface extending Error
// tslint:disable-next-line no-empty-interface interface-name


export var CombinedError = function CombinedError(_ref) {
  var networkError = _ref.networkError,
      graphQLErrors = _ref.graphQLErrors,
      response = _ref.response;
  this.name = void 0;
  this.message = void 0;
  this.graphQLErrors = void 0;
  this.networkError = void 0;
  this.response = void 0;
  this.name = 'CombinedError';
  this.graphQLErrors = (graphQLErrors || []).map(rehydrateGraphQlError);
  this.message = generateErrorMessage(networkError, this.graphQLErrors);
  this.networkError = networkError;
  this.response = response;
};
CombinedError.prototype = Object.create(Error.prototype);