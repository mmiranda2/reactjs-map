import React from 'react'
import Axios from 'axios'
import { Redirect } from 'react-router-dom'
import SignUpComp from '../components/SignUp'
import Button from '@material-ui/core/Button'
import Snackbar from '@material-ui/core/Snackbar'
import Slide from '@material-ui/core/Slide'
import { createAccount } from '../actions'
import { connect } from 'react-redux'

function SlideTransition(props) {
  return <Slide {...props} direction="up" />
}

class SignUp extends React.Component {
  state = {
    invalidPassword: false,
  }

  constructor(props) {
    super(props)
    this.handleSignUp = this.handleSignUp.bind(this)
    this.handleSnackClose = this.handleSnackClose.bind(this)
  }

  handleSignUp(e) {
    e.preventDefault()
    const email = document.getElementById('email').value
    const password = document.getElementById('password').value
    const firstname = document.getElementById('firstName').value
    const lastname = document.getElementById('lastName').value

    if (password.length < 8) {
      this.setState({ invalidPassword: true })
    } else if (!email.includes('@') || !email.includes('.')) {
      this.setState({ invalidEmail: true })
    } else {
      this.props.createAccount(email, password, firstname, lastname)
    }
  }

  handleSnackClose() {
    this.setState({ invalidPassword: false, invalidEmail: false })
  }

  render() {
    return (
      <div style={{ height: '100vh' }}>
        {this.props.user && this.props.handleBack()}
        <Button onClick={this.props.handleBack}>Back to map</Button>
        <SignUpComp attemptCreate={this.handleSignUp} />
        <Snackbar
          open={this.state.invalidPassword}
          onClose={this.handleSnackClose}
          TransitionComponent={SlideTransition}
          ContentProps={{
            'aria-describedby': 'message-id',
          }}
          message={
            <span id="message-id">Password must be at least 8 characters</span>
          }
        />
        <Snackbar
          open={this.state.invalidPassword}
          onClose={this.handleSnackClose}
          TransitionComponent={SlideTransition}
          ContentProps={{
            'aria-describedby': 'message-id',
          }}
          message={<span id="message-id">Please enter a valid email</span>}
        />
      </div>
    )
  }
}

export default connect(
  state => ({
    user: state.user,
  }),
  { createAccount }
)(SignUp)
