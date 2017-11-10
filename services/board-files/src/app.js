const app = require('express')()

const validFileNames = ['top-large.png', 'bottom-large.png']

app.get('/board-files/:projectId/:sha/images/:fileName', (req, res) => {
    const { projectId, sha, fileName } = req.params
    if (!validFileNames.includes(fileName)) {
        return res.sendStatus(404)
    }
    res.send()
})

module.exports = app
