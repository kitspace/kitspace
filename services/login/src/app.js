const app = require('express')()

app.get('/login', (req, res) => {
    res.send('hello')
})

module.exports = app
