const React = require('react')
const semantic = require('semantic-ui-react')
const ReactSearchInput = require('react-search-input')
const TitleBar = require('../title_bar')

function MakingProductsMeetup(props) {
  return (
    <div>
      <TitleBar route="/making-products-meetup/" />
      <semantic.Container style={{marginTop: 30}}>
        <h1>Making Products Meetup</h1>
        <p>
          Join us for our product design and manufacturing meetups in Bristol,
          UK. These meetups are for people making (or aspiring to make)
          hardware products. They provide networking and skills exchange between
          designers, engineers and local manufacturers. We have regular talks,
          workshops and social events.
        </p>
        <p>
          Sign up{' '}
          <a href="https://www.meetup.com/Making-Products/">
            through Meetup.com
          </a>{' '}
          or add your email below. If you would like to propose a talk please
          also add a title and description of your talk.
        </p>
        <p style={{display: 'flex', justifyContent: 'center'}}>
          <semantic.Card
            as="a"
            href="https://www.meetup.com/Making-Products/events/268380209/"
          >
            <semantic.Image src="/images/pmstudio.jpg" />
            <semantic.Card.Content>
              <semantic.Card.Header>
                First Ever Making Products Event
              </semantic.Card.Header>
              <semantic.Card.Meta>
                <span className="date">Tue, Feb 18 · 7:00 PM</span>
              </semantic.Card.Meta>
              <semantic.Card.Description>
                Social event in the Pervasive Media Studio in the Watershed
                cinema. Let's get to know each other and discuss ideas for
                future events.
              </semantic.Card.Description>
            </semantic.Card.Content>
          </semantic.Card>
        </p>
        <h3>Sign up</h3>
        <semantic.Form
          name="meetup-contact"
          method="POST"
          data-netlify="true"
          style={{padding: 15}}
        >
          <semantic.Form.Field>
            <label>Your Email</label>
            <input type="email" name="email" placeholder="you@example.com"/>
          </semantic.Form.Field>
          <semantic.Form.Field>
            <label>Proposed Talk Title (about 50 characters, optional)</label>
            <input type="text" name="talk-title" />
          </semantic.Form.Field>
          <semantic.Form.Field>
            <label>
              Proposed Talk Description (about 200 characters, optional)
            </label>
            <textarea name="talk-description" />
          </semantic.Form.Field>
          <semantic.Button primary type="submit">Submit</semantic.Button>
        </semantic.Form>
      </semantic.Container>
    </div>
  )
}

module.exports = MakingProductsMeetup
