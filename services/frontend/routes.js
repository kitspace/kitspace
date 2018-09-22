const Routes = require('next-routes')

const routes = Routes().add('/:namespace/:projectname', 'project')

module.exports = routes
