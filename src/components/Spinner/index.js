import React from 'react';
import { Backdrop } from '@mui/material';
import { CircularProgress, Box } from '@mui/material';
import { style } from '../../styles/style';

const useStyles = style
export default function SpinnerWithBackdrop() {
  const classes = useStyles()
  return (
    <Backdrop className={classes.backdrop} open={true}>
      <Box sx={{ display: 'flex' }}>
        <CircularProgress/>
      </Box>
    </Backdrop>
  );
}