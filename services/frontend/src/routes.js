import React from 'react'
import Home from './Home'
import Login from './Login'
import Settings from './settings/settings'

import {asyncComponent} from '@kitspace/after'

export default [
  {
    path: '/',
    exact: true,
    component: asyncComponent({
      loader: () => import('./Home'), // required
      Placeholder: () => <div>...LOADING...</div>, // this is optional, just returns null by default
    }),
  },
  {
    path: '/login',
    exact: true,
    component: Login,
  },
  {
    path: '/settings',
    exact: true,
    component: Settings,
  },
]
