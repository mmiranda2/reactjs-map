import React from 'react'
import { makeStyles } from '@material-ui/core/styles'
import Drawer from '@material-ui/core/Drawer'
import Button from '@material-ui/core/Button'
import List from '@material-ui/core/List'
import Divider from '@material-ui/core/Divider'
import ListItem from '@material-ui/core/ListItem'
import ArrowBackIcon from '@material-ui/icons/ArrowBack'
import IconButton from '@material-ui/core/IconButton'
import ListItemText from '@material-ui/core/ListItemText'
import ListIcon from '@material-ui/icons/List'

const useStyles = makeStyles({
  list: {
    width: 250,
  },
  fullList: {
    width: 'auto',
  },
})

export default function Sidebar(props) {
  const classes = useStyles()

  const sideList = onClick => (
    <div
      className={classes.list}
      role="presentation"
      onKeyDown={props.handleSidebar(false)}
    >
      {!props.user && (
        <List>
          <ListItem button key={'Sign In'} onClick={props.goToPage('signin')}>
            <ListItemText primary={'Sign In'} />
          </ListItem>
          <ListItem button key={'Sign Up'} onClick={props.goToPage('signup')}>
            <ListItemText primary={'Sign Up'} />
          </ListItem>
        </List>
      )}
      {props.user && (
        <List>
          <ListItem button key={'Log out'} onClick={() => props.logout()}>
            <ListItemText primary={'Log out'} />
          </ListItem>
        </List>
      )}
      <Divider />
      <List>
        <ListItem button key={'Help'} onClick={props.goToPage('help')}>
          <ListItemText primary={'Help'} />
        </ListItem>
        {/*['About', 'Github'].map(text => (
          <ListItem button key={text}>
            <ListItemText primary={text} />
          </ListItem>
        ))*/}
      </List>
    </div>
  )

  return (
    <div>
      <IconButton onClick={props.handleSidebar(true)}>
        <ListIcon />
      </IconButton>
      <Drawer
        open={props.sidebarOpen}
        onClose={props.handleSidebar(false)}
        className={classes.root}
      >
        <div style={{ display: 'inline' }}>
          <IconButton
            style={{ float: 'right' }}
            onClick={props.handleSidebar(false)}
          >
            <ArrowBackIcon />
          </IconButton>
        </div>
        {sideList()}
      </Drawer>
    </div>
  )
}
