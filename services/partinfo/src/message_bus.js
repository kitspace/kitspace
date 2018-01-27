const EventEmitter = require('events')

const request_bus = new EventEmitter()
const response_bus = new EventEmitter()

module.exports = {request_bus, response_bus}
