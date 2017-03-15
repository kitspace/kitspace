const React    = require('react')
const {Message} = require('semantic-ui-react')

function message(header, message) {
  return (
    <Message key={message} error={header === 'Error'} warning={header === 'Warning'}>
      <Message.Header>{header}</Message.Header>
      <p>{message}</p>
    </Message>)
}

module.exports = {message}
