import React from 'react'
import Button from '@material-ui/core/Button'
import Menu from '@material-ui/core/Menu'
import MenuItem from '@material-ui/core/MenuItem'

export default function DropMenu(props) {
  const [anchorEl, setAnchorEl] = React.useState(null)

  const handleClick = event => {
    setAnchorEl(event.currentTarget)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  return (
    <div>
      <Button
        aria-controls="simple-menu"
        aria-haspopup="true"
        onClick={handleClick}
      >
        {props.name}
      </Button>
      <Menu
        id="simple-menu"
        keepMounted
        open={Boolean(anchorEl)}
        anchorEl={anchorEl}
        onClose={handleClose}
        getContentAnchorEl={null}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        transformOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        {props.items.map(item => (
          <MenuItem onClick={item.handler} key={item.message}>
            {item.message}
          </MenuItem>
        ))}
        {!props.items.length && (
          <MenuItem disabled={true} key={'no polys'}>
            {props.noneMessage}
          </MenuItem>
        )}
      </Menu>
    </div>
  )
}
