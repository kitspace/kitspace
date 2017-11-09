import * as React from 'react';
import Head from 'next/head';
import * as semantic from 'semantic-ui-react';
import * as superagent from 'superagent';
import * as redux from 'redux';
import withRedux from 'next-redux-wrapper';
import immutable from 'immutable';

import TitleBar from '../components/TitleBar';
import {
  unboundActions,
  initialState,
  rootReducer,
  makeStore,
  mapDispatchToProps,
} from './index/_state';

function getProjectIds() {
  return superagent
    .get('https://gitlab2.kitnic.it/accounts/api/v4/projects')
    .then(r => r.body)
    .then(projects =>
      projects.map(({id, path_with_namespace, description}) => ({
        id,
        path_with_namespace,
        description,
      })),
    )
    .catch(e => {
      console.warn(e);
      return [];
    });
}

function getUser() {
  return superagent
    .get('https://gitlab2.kitnic.it/accounts/api/v4/user')
    .then(r => r.body)
    .catch(e => 'not signed in');
}

class Index extends React.Component {
  static getInitialProps = ({store, isServer, pathname, query}) => {
    const actions = redux.bindActionCreators(unboundActions, store.dispatch);
    return getProjectIds()
      .then(actions.setProjectIds)
      .then(() => ({}));
  };
  componentDidMount = () => {
    getUser().then(this.props.setUser);
  };
  render() {
    return (
      <div>
        <Head>
          <title>kitspace.org</title>
          <link href="/static/index.css" rel="stylesheet" />
        </Head>
        <TitleBar user={this.props.user}>kitnic.it</TitleBar>
        <pre>{JSON.stringify(this.props.projects, null, 2)}</pre>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {user: state.get('user'), projects: state.get('projects')};
}

export default withRedux(makeStore, mapStateToProps, mapDispatchToProps)(Index);
