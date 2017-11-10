const app = require('express')()

app.get("/gerbers/:projectId/:sha/images/:fileName", (req, res) => {
  const {projectId, sha, fileName} = req.params
})


module.exports = app
