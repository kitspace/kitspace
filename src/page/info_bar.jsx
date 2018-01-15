const React = require('react')

function InfoBar(props) {
  const info = props.info
  let site, repo
  if (info.site == null || info.site === '') {
    site = (
      <div className="disabledSite" title="no website info available">
        <span className="octicon octicon-link" /> website
      </div>
    )
  } else {
    site = (
      <a href={info.site}>
        <span className="octicon octicon-link" /> website
      </a>
    )
  }
  if (info.repo == null || info.repo === '') {
    repo = (
      <div className="disabledSite" title="no repo info available">
        <span className="octicon octicon-link" /> repo
      </div>
    )
  } else {
    repo = (
      <a href={info.repo}>
        <span className="octicon octicon-repo" /> repo
      </a>
    )
  }
  return (
    <div className="infoBar">
      <div className="infoBarInner">
        <div className="infoBarSummary">{info.summary}</div>
        <div className="infoBarLinksContainer">
          <div className="infoBarLinks">{site}</div>
          <div className="infoBarLinks">{repo}</div>
        </div>
      </div>
    </div>
  )
}

module.exports = InfoBar
