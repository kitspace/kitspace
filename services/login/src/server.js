const app = require('./app')

const port = 4004

app.listen(port)
console.log(`Running ${process.env.npm_package_name} at localhost:${port}`)
