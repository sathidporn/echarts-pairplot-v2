import * as React from 'react';
// import { useState, useEffect } from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
// import DialogTitle from '@mui/material/DialogTitle';
// import Slide from '@mui/material/Slide';
import { style } from '../../styles/style';
import { Typography } from '@mui/material';
const useStyles = style


// const Transition = React.forwardRef(function Transition(props, ref) {
//   return <Slide direction="up" ref={ref} {...props} />;
// });

export default function DialogMessage({message, open, handleCloseDialog = () => {} }) {
  const classes = useStyles()
  return (
    <div>
      {/* <Button variant="outlined" onClick={handleClickOpen}>
        Slide in alert dialog
      </Button> */}
      <Dialog
        open={open}
        // TransitionComponent={Transition}
        keepMounted
        onClose={handleCloseDialog}
        PaperProps={{
          style: { border: '1px solid white', borderRadius: 10 }
        }}
      >
        {/* <DialogTitle>{"Use Google's location service?"}</DialogTitle> */}
        <DialogContent className={classes.dialogMessage}>
          <DialogContentText id="alert-dialog-slide-description" className={classes.dialogMessage}>
            {message}
          </DialogContentText>
        </DialogContent>
        <DialogActions className={classes.dialogMessage}>
          {/* <Button onClick={handleClose}>Disagree</Button> */}
          <Button onClick={handleCloseDialog} className={classes.defaultButton}>
            <Typography className={classes.whiteText}>OK</Typography>
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
