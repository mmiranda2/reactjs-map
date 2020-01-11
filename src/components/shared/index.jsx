import React from 'react'
import Slide from '@material-ui/core/Slide'
import Snackbar from '@material-ui/core/Snackbar'
import Typography from '@material-ui/core/Typography'
import Card from '@material-ui/core/Card'
import CardActions from '@material-ui/core/CardActions'
import CardContent from '@material-ui/core/CardContent'
import Button from '@material-ui/core/Button'
import CloseIcon from '@material-ui/icons/Close'
import IconButton from '@material-ui/core/IconButton'
import Draggable from 'react-draggable'

export const SlideTransition = props => <Slide {...props} direction="up" />

export const Snack = props => (
  <Snackbar
    open={props.open}
    onClose={props.onClose}
    TransitionComponent={SlideTransition}
    ContentProps={{
      'aria-describedby': 'message-id',
    }}
    message={<span id="message-id">{props.message}</span>}
  />
)

export const InfoCard = props => (
  <Draggable>
    <Card>
      <div style={{ display: 'flex' }}>
        <CardActions>
          <IconButton onClick={props.closeMetrics}>
            <CloseIcon />
          </IconButton>
        </CardActions>
        <CardContent>
          {props.messages.map(message => (
            <Typography color="textSecondary" style={{ paddingTop: '9px' }}>
              {`Total ${message.property} of ${message.num} points in the polygon: ${message.sum}`}
            </Typography>
          ))}
        </CardContent>
      </div>
    </Card>
  </Draggable>
)
