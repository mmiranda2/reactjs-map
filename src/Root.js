import React from 'react'
import PropTypes from 'prop-types'
import { Provider } from 'react-redux'
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'
import App from './App'
import SignUp from './containers/SignUp'
import SignIn from './containers/SignIn'
import Help from './containers/Help'
import { makeStyles } from '@material-ui/core/styles'
import Container from '@material-ui/core/Container'
import CssBaseline from '@material-ui/core/CssBaseline'

const useStyles = makeStyles(theme => ({
  App: {
    background: theme.palette.background.paper,
  },
}))

const AppWrap = props => {
  const classes = useStyles()
  return (
    <Container component="main" maxWidth={false} disableGutters={true}>
      <CssBaseline />
      <div className={classes.App}>
        <App {...props} />
      </div>
    </Container>
  )
}
const Root = ({ store }) => {
  return (
    <Provider store={store}>
      <Router>
        <Switch>
          <Route path="/signup" component={SignUp} />
          <Route path="/signin" component={SignIn} />
          <Route path="/help" component={Help} />
          <Route path="/" component={AppWrap} />
        </Switch>
      </Router>
    </Provider>
  )
}

Root.propTypes = {
  store: PropTypes.object.isRequired,
}

export default Root
