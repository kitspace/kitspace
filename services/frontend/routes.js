const Routes = require('next-routes')

const routes = Routes().add('/:namespace/:projectname', 'project')

routes.Router.onRouteChangeStart = url => {
  console.log('App is changing to: ', url)
}

module.exports = routes
