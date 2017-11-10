const app = require('express')()

app.get("/board-files/:projectId/:sha/images/:fileName", (req, res) => {
  const {projectId, sha, fileName} = req.params
  res.send()
})


module.exports = app
