import React from 'react'
import Home from './Home'
import Login from './Login'
import Settings from './settings/settings'

import {asyncComponent} from '@kitspace/after'

export default [
  {
    path: '/',
    exact: true,
    component: Home,
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
