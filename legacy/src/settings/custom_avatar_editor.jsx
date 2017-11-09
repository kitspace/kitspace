const React             = require('react')
const ReactAvatarEditor = require('react-avatar-editor').default
const semantic          = require('semantic-ui-react')

class CustomAvatarEditor extends React.Component {
  state = {
    position: { x: 0.5, y: 0.5 },
    scale: 1,
    rotate: 0,
    borderRadius: 0,
    width: 200,
    height: 200
  }

  handleScale = (e) => {
    const scale = parseFloat(e.target.value)
    this.setState({ scale })
  }

  rotateLeft = (e) => {
    e.preventDefault()

    this.setState({
      rotate: this.state.rotate - 90
    })
  }

  rotateRight = (e) => {
    e.preventDefault()
    this.setState({
      rotate: this.state.rotate + 90
    })
  }

  handleBorderRadius = (e) => {
    const borderRadius = parseInt(e.target.value)
    this.setState({ borderRadius })
  }

  handleXPosition = (e) => {
    const x = parseFloat(e.target.value)
    this.setState({ position: { ...this.state.position, x } })
  }

  handleYPosition = (e) => {
    const y = parseFloat(e.target.value)
    this.setState({ position: { ...this.state.position, y } })
  }

  handleWidth = (e) => {
    const width = parseInt(e.target.value)
    this.setState({ width })
  }

  handleHeight = (e) => {
    const height = parseInt(e.target.value)
    this.setState({ height })
  }

  handlePositionChange = position => {
    this.setState({ position })
  }

  render () {
    return (
      <div style={{display:'flex', alignItems:'center', justifyContent:'space-around'}}>
        <ReactAvatarEditor
          ref={editor => this.editor = editor}
          scale={parseFloat(this.state.scale)}
          width={this.state.width}
          height={this.state.height}
          position={this.state.position}
          onPositionChange={this.handlePositionChange}
          rotate={parseFloat(this.state.rotate)}
          borderRadius={this.state.borderRadius}
          image={this.props.image}
        />
        <input
          name='scale'
          type='range'
          onChange={this.handleScale}
          min='1'
          max='2'
          step='0.01'
          defaultValue='1'
        />
      </div>
    )
  }
}

// Used to display the cropping rect
class ImageWithRect extends React.Component {
  constructor (props) {
    super(props)

    this.setCanvas = ::this.setCanvas
    this.handleImageLoad = ::this.handleImageLoad
  }

  componentDidMount () {
    this.redraw()
  }

  componentDidUpdate () {
    this.redraw()
  }

  setCanvas (canvas) {
    if (canvas) this.canvas = canvas
  }

  handleImageLoad () {
    const ctx = this.canvas.getContext('2d')
    const { rect, width, height } = this.props

    ctx.clearRect(0, 0, width, height)

    ctx.strokeStyle = 'red'

    if (rect && (rect.width > 1 || rect.height > 1)) {
      ctx.drawImage(
        this.imgElement,
        Math.round(-rect.x * (width / rect.width)),
        Math.round(-rect.y * (height / rect.height)),
        Math.round(width / rect.width),
        Math.round(height / rect.height)
      )

      if (rect) {
        ctx.strokeRect(
          1,
          1,
          Math.round(width) - 2,
          Math.round(height) - 2
        )
      }
    } else {
      ctx.drawImage(this.imgElement, 0, 0, width, height)

      if (rect) {
        ctx.strokeRect(
          Math.round(rect.x * width) + 0.5,
          Math.round(rect.y * height) + 0.5,
          Math.round(rect.width * width),
          Math.round(rect.height * height)
        )
      }
    }
  }

  redraw () {
    const img = new Image()

    img.src = this.props.image
    img.onload = this.handleImageLoad
    this.imgElement = img
  }

  render () {
    return (
      <canvas
        ref={this.setCanvas}
        style={this.props.style}
        width={this.props.width}
        height={this.props.height}
      />
    )
  }
}

module.exports = CustomAvatarEditor
