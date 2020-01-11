import React from 'react'
import Button from '@material-ui/core/Button'
import HelpComp from '../components/Help'

class Help extends React.Component {
  constructor(props) {
    super(props)
  }

  render() {
    return (
      <div style={{ height: '100vh' }}>
        <Button onClick={this.props.handleBack}>Back to map</Button>
        <HelpComp />
      </div>
    )
  }
}

export default Help
