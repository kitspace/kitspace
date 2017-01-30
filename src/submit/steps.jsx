const React  = require('react')
const {Step} = require('semantic-ui-react')

module.exports = function Steps(props) {
    return (
      <div className='stepsContainer'>
        <Step.Group ordered stackable='tablet'>
          <Step active={props.active === 0} onClick={props.setStep(0)}>
            {'Preview the board'}
          </Step>
          <Step active={props.active === 1} onClick={props.setStep(1)}>
            {'Preview the bill of materials'}
          </Step>
          <Step active={props.active === 2} onClick={props.setStep(2)}>
            {'Preview the readme'}
          </Step>
          <Step completed active={props.active === 3} onClick={props.setStep(3)}>
            {'Submit'}
          </Step>
        </Step.Group>
      </div>
  )
}
