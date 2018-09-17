const React = require('react')
const TitleBar = require('../title_bar')
const semantic = require('semantic-ui-react')

class Privacy extends React.Component {
  render() {
    return (
      <div className="Privacy">
        <TitleBar submissionButton>
          <div className="titleText">Privacy Policy</div>
        </TitleBar>
        <semantic.Container>
          <h1>The Kitspace Privacy Policy</h1>
          <p>
            Hello. We are Kitspace and we run the our website kitspace.org and
            the services it provides. Here are the answers to some Frequently
            Asked Questions about our Privacy Policy:
          </p>
          <h2>What information do we collect?</h2>
          <ul>
            <li>
              We host our own instance of Matomo to monitor and analyse the use
              of our services.
            </li>
            <li>
              When you visit kitspace.org we record your IP address (but scrub
              the last two bytes, eg. 192.168.xxx.xxx), browser type, browser
              version, which pages of our website you visited and for how long,
              when you visited our site, unique device identifiers and other
              diagnostic data.
            </li>
          </ul>
          <h2>What do we use your information for?</h2>
          <p>
            Any of the information we collect from you may be used in one of the
            following ways:
          </p>
          <ul>
            <li>
              To personalize your experience — your information helps us to
              better respond to your individual needs.
            </li>
            <li>
              To improve our site — we continually strive to improve our site
              offerings based on the information and feedback we receive from
              you.
            </li>
            <li>
              To improve customer service — your information helps us to more
              effectively respond to your customer service requests and support
              needs.
            </li>
            <li>
              To send periodic emails — the email address you provide may be
              used to send you information, notifications that you request about
              changes to topics or in response to your user name, respond to
              inquiries, and/or other requests or questions.{' '}
            </li>
          </ul>
          <h2>How do we protect your information and do I have any rights?</h2>
          <p>
            <li>
              We implement a variety of security measures to maintain the safety
              of your personal information when you enter, submit, or access
              your personal information.
            </li>
            <li>
              If you think that we have not sufficiently protected your personal
              information or that there has been a data breach, you have the
              right to directly file a complaint with the local supervisory
              authority. But please contact us and we will do our best to
              resolve the problem for you first!
            </li>
          </p>
          <h2>What is your data retention policy?</h2>
          <p>We will make a good faith effort to:</p>
          <ul>
            <li>
              Retain server logs containing the IP address of all requests to
              this server no more than 90 days.
            </li>
            <li>
              Retain the IP addresses associated with registered users and their
              posts no more than 5 years.
            </li>
          </ul>
          <h2>Do we use cookies?</h2>
          <p>
            Yes. Cookies are small files that a site or its service provider
            transfers to your computer’s hard drive through your Web browser (if
            you allow). These cookies enable the site to recognize your browser
            and, if you have a registered account, associate it with your
            registered account.
          </p>
          <p>
            We use cookies to understand and save your preferences for future
            visits and compile aggregate data about site traffic and site
            interaction so that we can offer better site experiences and tools
            in the future. We may contract with third-party service providers to
            assist us in better understanding our site visitors. These service
            providers are not permitted to use the information collected on our
            behalf except to help us conduct and improve our business.
          </p>
          <h2>Do we disclose any information to outside parties?</h2>
          <p>
            We do not disclose your personally identifiable information to 
            outside parties for the purpose of selling your information, trading 
            it or otherwise transferring it. However, we do disclose your 
            information to trusted third parties who assist us in operating our site, 
            conducting our business, or servicing you. These third parties are under 
            the agreement that they will keep this information confidential.
           </p>
           <p>
            We may also release your information when we believe release is 
            appropriate to comply with the law, enforce our site policies, or 
            protect ours or others rights, property, or safety.
           <p>
            Non-personally identifiable visitor information may be provided to 
            other parties for other uses.
          </p>
          <h2>Third party links</h2>
          <p>
            Occasionally, at our discretion, we may include or offer third party
            products or services on our site. These third party sites have
            separate and independent privacy policies. We therefore have no
            responsibility or liability for the content and activities of these
            linked sites. Nonetheless, we seek to protect the integrity of our
            site and welcome any feedback about these sites.
          </p>
          <h2>Children’s Online Privacy Protection Act Compliance</h2>
          <p>
            Our site, products and services are all directed to people who are
            at least 13 years old or older. If this server is in the USA, and
            you are under the age of 13, per the requirements of COPPA
            (Children’s Online Privacy Protection Act), do not use this site.
          </p>
          <h2>Online Privacy Policy Only</h2>
          <p>
            This online privacy policy applies only to information collected
            through our site and not to information collected offline.
          </p>
          <h2>Your Consent</h2>
          <p>
            By using our site, you consent to our web site privacy policy. You
            may opt-in and opt-out of tracking below.
          </p>
          <iframe
            style={{border: 0, height: 200, width: 600}}
            src="https://matomo.kitspace.org/index.php?module=CoreAdminHome&action=optOut&language=en&backgroundColor=&fontColor=&fontSize=&fontFamily=Noto%20Sans"
          />
          <h2>Contact Us</h2>
          <p>
            If you have any questions about this Privacy Policy or would like
            your data removed, please contact us:
          </p>
          <ul>
            <li>
              By email: <a href="mailto:info@kitspace.org">info@kitspace.org</a>
            </li>
          </ul>
          <h2>Changes to our Privacy Policy</h2>
          <p>
            If we decide to change our privacy policy, we will post those
            changes on this page.
          </p>
          <p>
            This document is CC-BY-SA. We adapted it from the{' '}
            <a href="https://github.com/discourse/discourse/blob/af8ea2d87d40da9b2ac677e56ad9e4af7a4b393e/app/views/static/privacy.en.html.erb">
              Discourse default privacy policy
            </a>. It was last updated 4th September, 2018
          </p>
        </semantic.Container>
      </div>
    )
  }
}

module.exports = Privacy
