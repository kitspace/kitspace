const React = require('react')
const createClass = require('create-react-class')

// Remove templating and extract inner content from IBOM HTML file.
// (DONE THIS WAY TO AVOID CHANGES TO IBOM HTML!)
const bomHtmlIn = String(require('./InteractiveHtmlBom/ibom.html'))
const template1 = RegExp('^///[a-z_-]+///$\n', 'mgi')
const template2 = RegExp('^/{10,}$\n', 'mg')
const bodyStart = RegExp('^<body>$\n', 'mi')
const bodyEnd = RegExp('^</body>$\n', 'mi')
const bomHtmlTmp = bomHtmlIn.replace(template1, '').replace(template2, '')
const bodyStartIdx = bomHtmlTmp.search(bodyStart)
const bodyEndIdx = bomHtmlTmp.search(bodyEnd)
const bomHtml = bomHtmlTmp.slice(bodyStartIdx + 7, bodyEndIdx)

const IBOMUI = createClass({
  render() {
    return (
      <div className="ibom" dangerouslySetInnerHTML={{__html: bomHtml}}/>
    )
  },
  componentDidMount() {
    pcbdata = this.props.pcbdata
    window.onresize = resizeAll;
    window.matchMedia("print").addListener(resizeAll);
    initBOM()
  }
})

module.exports = IBOMUI
