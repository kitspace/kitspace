import immutable from 'immutable'
import * as redux from 'redux';

export const initialState = immutable.fromJS({
  user: 'loading',
  projects: [],
});

const rootReducers = {
  setUser(state, user) {
    return state.merge({user: immutable.fromJS(user)});
  },
  setProjectIds(state, projects) {
    return state.merge({projects: immutable.List(projects)});
  },
};

function makeActions(reducers) {
  const actions = {};
  Object.keys(reducers).forEach(name => {
    actions[name] = function createAction(value) {
      return {type: name, value};
    };
  });
  return actions;
}

function makeReducer(reducers, initialState) {
  return function reducer(state = initialState, action) {
    if (Object.keys(reducers).includes(action.type)) {
      return reducers[action.type](state, action.value);
    }
    return state;
  };
}

export const unboundActions = makeActions(rootReducers);

export function mapDispatchToProps(dispatch) {
  return redux.bindActionCreators(unboundActions, dispatch)
}

export const rootReducer = makeReducer(rootReducers, initialState);

export function makeStore(init) {
  if (!init) {
    init = initialState
  }
  // Nasty duck typing, you should find a better way to detect
  if (!init.toJS) {
    init = immutable.fromJS(init);
  }
  return redux.createStore(rootReducer, init);
}
