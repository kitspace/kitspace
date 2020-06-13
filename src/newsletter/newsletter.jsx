const React = require('react')
const semantic = require('semantic-ui-react')
const ReactSearchInput = require('react-search-input')
const TitleBar = require('../title_bar')

const Newsletter = React.createClass({
  render() {
    return (
      <div>
        <TitleBar route="/newsletter/" />
        <semantic.Container style={{marginTop: 30}}>
          <p>
            Often people say to us: "Wow that's a nice printed circuit board. I
            would like to subscribe to your newsletter." Now you can! Let us
            know what would like to hear about exactly. Don't worry, it's easy
            to unsubscribe if you change your mind.
          </p>
          <semantic.Form
            name="newsletter"
            method="POST"
            data-netlify="true"
            style={{padding: 15}}
          >
            <semantic.Form.Field>
              <label>Your Email:</label>
              <input
                required
                type="email"
                name="email"
                placeholder="you@example.com"
                style={{maxWidth: 300}}
              />
            </semantic.Form.Field>
            <div hidden aria-hidden="true">
              <label>
                Don’t fill this out if you're human:
                <input name="bot-field" />
              </label>
            </div>
            <semantic.Form.Group grouped>
              <label>Interested in:</label>
              <semantic.Form.Field
                label="Updates about Kitspace itself"
                control="input"
                type="checkbox"
                defaultChecked
              />
              <semantic.Form.Field
                label="New projects added"
                control="input"
                type="checkbox"
                defaultChecked
              />
              <semantic.Form.Field
                label="Articles and tutorials"
                control="input"
                type="checkbox"
                defaultChecked
              />
            </semantic.Form.Group>
            <semantic.Form.Field inline size="tiny">
              <label htmlFor="anything-else">Anything else: </label>
              <input
                style={{height: 12}}
                type="text"
                name="anything-else"
                id="anything-else"
              />
            </semantic.Form.Field>
            <semantic.Button primary type="submit">
              Subscribe
            </semantic.Button>
          </semantic.Form>
        </semantic.Container>
      </div>
    )
  }
})

module.exports = Newsletter
