'use strict';
const browserVersion   = require('browser-version');
const installExtension = () => {
  const version = browserVersion();
  let onClick;
  if (/Chrome/.test(version)) {
    onClick = () => {
      chrome.webstore.install( //eslint-disable-line no-undef
        undefined, undefined, (err) =>
            console.log(err) //eslint-disable-line no-console
            );};
  } else if (/Firefox/.test(version)) {
    onClick = () => {
      window.open(
        '//addons.mozilla.org/firefox/' +
        'downloads/latest/634060/addon-634060-latest.xpi',
        '_self');
    };
  } else {
    onClick = () => {
      window.open('//1clickBOM.com', '_self');
    };
  }
  return onClick;
};

module.exports = installExtension();
