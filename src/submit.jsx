const Markdown = require('react-markdown')
const Redux    = require('redux')

const React     = require('react')
const { Input, Icon, Step, Container } = require('semantic-ui-react')

const initial_state = {
  activeStep: 1,
}

function reducer(state = initial_state, action) {
  console.log(action)
  switch(action.type) {
    case 'setStep':
      return Object.assign(state, {activeStep: action.value})
  }
  return state
}

const store = Redux.createStore(reducer)

const TitleBar  = require('./title_bar')

const instructionText =
`
- Plot Gerbers (RS274-X) & drill data from your CAD program.
- Put the files into a \`gerbers/\` directory in a publicly accessible git repository
(you could use [GitLab](https://gitlab.com) or [GitHub](https://github.com) for instance).

If you would like to put them somewhere else in your repository please also add a
kitnic.yaml with a field \`gerbers:\` followed by the path to the directory so Kitnic can find it.
Use forward slashes as path seperators, e.g. \`gerbers: hardware/gerbers\`.

Preview your board by entering the repository URL below.
`

const Steps = React.createClass({
  render: function () {
    return (
      <div className='stepsContainer'>
        <Step.Group ordered stackable='tablet'>
          <Step active={this.props.active === 1} onClick={handleClick(1)}>
            Preview the board
          </Step>
          <Step active={this.props.active === 2} onClick={handleClick(2)}>
            Preview the bill of materials
          </Step>
          <Step active={this.props.active === 3} onClick={handleClick(3)}>
            Preview the readme
          </Step>
          <Step active={this.props.active === 4} onClick={handleClick(4)}>
            Send us a pull-request to add your board
          </Step>
        </Step.Group>
      </div>
    )
  }
})

const Submit = React.createClass({
  getInitialState: function() {
    return store.getState()
  },
  render: function () {
    return (
    <div className='Submit'>
      <TitleBar>
        <div className='titleText'>
          Submit a project
        </div>
      </TitleBar>
      <div className='content'>
        <Steps active={this.state.activeStep} />
        <Markdown className='instructions' source={instructionText} />
        <div className='previewContainer'>
          <Input fluid action={{color:'green', content:'preview'}} placeholder='https://github.com/kitnic-forks/arduino-uno' />
        </div>
      </div>
    </div>
    )
  },
  componentDidMount: function () {
    store.subscribe(() => {
        this.setState(store.getState())
    })
  }
})

function handleClick(step) {
   return () => {
      store.dispatch({type:'setStep', value:step})
   }
}


module.exports = Submit
