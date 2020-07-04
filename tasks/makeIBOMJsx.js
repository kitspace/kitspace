const fs = require('fs')
const htmlToJsx = require('htmltojsx')
const utils = require('./utils/utils')

const converter = new htmlToJsx({createClass: false})

if (require.main !== module) {
  module.exports = function(config) {
    let deps
    const targets = ['build/.temp/interactive_bom/IBOM.jsx']
    deps = ['src/interactive_bom/InteractiveHtmlBom/ibom.html']
    return {deps, targets, moduleDep: false}
  }
} else {
  const {config, deps, targets} = utils.processArgs(process.argv)
  let jsx = targets[0]
  let html = deps[0]
  const bomHtmlIn = fs.readFileSync(html, 'utf8')
  const template1 = RegExp('^///[a-z_-]+///$\n', 'mgi')
  const template2 = RegExp('^/{10,}$\n', 'mg')
  const bodyStart = RegExp('^<body>$\n', 'mi')
  const bodyEnd = RegExp('^</body>$\n', 'mi')
  const bomHtmlTmp = bomHtmlIn.replace(template1, '').replace(template2, '')
  const bodyStartIdx = bomHtmlTmp.search(bodyStart)
  const bodyEndIdx = bomHtmlTmp.search(bodyEnd)
  const bomHtml = bomHtmlTmp.slice(bodyStartIdx + 7, bodyEndIdx)
  const reactComponent = converter.convert(`${bomHtml}`)

  // And now we have to work around this bug in htmltojsx:
  // https://github.com/reactjs/react-magic/issues/158. The solution
  // adopted here is pretty reprehensible. A more principled approach
  // would be to fix the htmltojsx package, but the PR open to fix
  // this problem is stale, and I don't want to take the time to
  // freshen it up...
  const reactComponentFixed =
    reactComponent.replace(/{"/g, '"').replace(/"}/g, '"')

  fs.writeFileSync(
    jsx,
    `
    const React = require('react');
const createClass = require('create-react-class');

const IBOM = createClass({
  render() {
    return (
      ${reactComponentFixed}
    )
  },
  componentDidMount() {
    pcbdata = this.props.pcbdata
    window.onresize = resizeAll;
    window.matchMedia("print").addListener(resizeAll);
    initBOM()
  }
})

module.exports = IBOM;
    `)
}
