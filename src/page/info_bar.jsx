const React = require('react')

function InfoBar(props) {
  const info = props.info
  const idText = info.id
    .split('/')
    .slice(-1)
    .join(' / ')
  const subtitleText = info.id
    .split('/')
    .slice(0, 2)
    .join(' / ')
  let site
  if (info.site) {
    site = (
      <span>
        {'  |  '}<a href={info.site}>homepage</a>
      </span>
    )
  }
  return (
    <div className="infoBar">
      <div className="infoBarInner">
        <div className="infoBarTitle">
          <div className="titleText">{idText}</div>
          <div className="subtitleText">
            <a href={info.repo}>{subtitleText}</a>
            {site}
          </div>
        </div>
        <div className="infoBarTitle">
          <div className="infoBarSummary">{info.summary}</div>
        </div>
      </div>
    </div>
  )
}

module.exports = InfoBar
