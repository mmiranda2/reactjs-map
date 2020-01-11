import React from 'react'
import Axios from 'axios'
import { Redirect } from 'react-router-dom'
import SignInComp from '../components/SignIn'
import Button from '@material-ui/core/Button'
import Snackbar from '@material-ui/core/Snackbar'
import { login } from '../actions'
import { connect } from 'react-redux'
import { Snack } from '../components/shared'
import Slide from '@material-ui/core/Slide'

function SlideTransition(props) {
  return <Slide {...props} direction="up" />
}

class SignIn extends React.Component {
  state = {
    wrongPassword: false,
  }

  constructor(props) {
    super(props)
    this.handleSignIn = this.handleSignIn.bind(this)
  }

  handleSignIn(e) {
    e.preventDefault()
    const email = document.getElementById('email').value
    const password = document.getElementById('password').value
    Axios.post('/api/auth/attempt_login', {
      email,
      password,
    }).then(({ data }) => {
      if (data.verified) {
        this.props.login(email)
      } else {
        this.setState({ wrongPassword: true })
      }
    })
  }

  render() {
    return (
      <div style={{ height: '100vh' }}>
        {this.props.user && this.props.handleBack()}
        <Button onClick={this.props.handleBack}>Back to map</Button>
        <SignInComp login={this.handleSignIn} />
        <Snack
          open={this.state.wrongPassword}
          onClose={() => this.setState({ wrongPassword: false })}
          message={'Password incorrect. Please try again.'}
        />
      </div>
    )
  }
}

export default connect(
  state => ({
    user: state.user,
  }),
  { login }
)(SignIn)
