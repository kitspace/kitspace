var createQuery = function createQuery(q, vars) {
  return {
    query: q,
    variables: vars || {}
  };
};

export var query = createQuery;
export var mutation = createQuery;
export var subscription = createQuery;