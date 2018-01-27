#!/usr/bin/env node
const app = require('./app')

const port = process.env.PORT || 4001
app.listen(port)
console.log(`Running a GrapQL Express server at localhost:${port}`)
