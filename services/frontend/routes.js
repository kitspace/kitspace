const routes = require('next-routes')

module.exports = routes()
  .add('/:namespace/:projectname', 'project')
