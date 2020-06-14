const React = require('react')
const semantic = require('semantic-ui-react')
const TitleBar = require('../title_bar')

function Newsletter() {
  return (
    <div>
      <TitleBar route="/newsletter/" />
      <semantic.Container style={{marginTop: 50}}>
        <p>
          Often people say to us: "Wow that's a nice printed circuit board. I
          would like to subscribe to your newsletter." Now you can! Let us know
          what would like to hear about exactly. Don't worry, it's easy to
          unsubscribe if you change your mind later. If you just want to get in
          touch email <a href="mailto:info@kitspace.org">info@kitspace.org</a>{' '}
          instead.
        </p>
        <semantic.Form
          name="newsletter"
          method="POST"
          data-netlify="true"
          style={{padding: 15}}
        >
          <input type="hidden" name="form-name" value="newsletter" />
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
              name="updates"
              control="input"
              type="checkbox"
              defaultChecked
            />
            <semantic.Form.Field
              label="New projects added"
              name="new_projects"
              control="input"
              type="checkbox"
              defaultChecked
            />
            <semantic.Form.Field
              label="Articles and tutorials"
              name="articles"
              control="input"
              type="checkbox"
              defaultChecked
            />
          </semantic.Form.Group>
          <semantic.Form.Field inline size="tiny">
            <label htmlFor="anything_else">Anything else: </label>
            <input
              style={{height: 13}}
              type="text"
              name="anything_else"
              id="anything_else"
            />
          </semantic.Form.Field>
          <semantic.Button primary type="submit" style={{marginTop: 30}}>
            Subscribe
          </semantic.Button>
        </semantic.Form>
      </semantic.Container>
    </div>
  )
}

module.exports = Newsletter
