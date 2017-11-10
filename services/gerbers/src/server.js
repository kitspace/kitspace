const app = require('./app')

const port = process.env.PORT || 4003

app.listen(port)
console.log(`Running ${process.env.npm_package_name} at localhost:${port}`)
