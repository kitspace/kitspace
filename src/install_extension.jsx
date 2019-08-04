const browserVersion = require('browser-version')
function installExtension() {
  const version = browserVersion()
  let onClick
  if (/Chrome/.test(version)) {
    onClick = () => {
      chrome.webstore.install(
        //eslint-disable-line no-undef
        undefined,
        undefined,
        err => console.log(err) //eslint-disable-line no-console
      )
    }
  } else if (/Firefox/.test(version)) {
    onClick = () => {
      window.open('https://addons.mozilla.org/en-US/firefox/addon/1clickbom')
    }
  } else {
    onClick = () => {
      window.open('/1-click-bom', '_self')
    }
  }
  return onClick
}

module.exports = installExtension()
