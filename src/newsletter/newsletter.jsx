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
          would like to subscribe to your newsletter." Now you can! If you're
          curious, you can read the latest edition first:{' '}
          <a href="https://buttondown.email/kitspace/archive/kitspace-newsletter-1-assembling-projects/">
            #1: Kitspace Newsletter #1: Assembling Projects.
          </a>
        </p>
        <p>
          Subscribe below, don't worry, it's easy to unsubscribe if you change your mind later.
          If you just want to get in touch email{' '}
          <a href="mailto:info@kitspace.org">info@kitspace.org</a> instead.
        </p>
        <semantic.Form
          name="newsletter"
          method="POST"
          action="POST"
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
          <semantic.Button primary type="submit">
            Subscribe
          </semantic.Button>
        </semantic.Form>
      </semantic.Container>
    </div>
  )
}

module.exports = Newsletter
