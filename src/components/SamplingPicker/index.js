// import papa from 'papaparse'
import React, { useCallback, useState } from 'react';
import Grid from '@mui/material/Grid'
import { Typography, Button } from '@mui/material';
import SelectorItem from '../SelectorItem';
import { style } from '../../styles/style';
const useStyles = style

const samplingList = [
  {value: "select", name: "Select sampling"}, 
  {value: "mean", name: "Mean"}, 
  {value: "max", name: "Max"}, 
  {value: "min", name: "Min"}, 
  {value: "first", name: "First"}, 
  {value: "last", name: "Last"}, 
]


export default function SamplingPicker({ onSamplingData = () => {}}) {
  const classes = useStyles();
  let [samplingType, setSamplingType] = useState("select")

  return (
      <Grid item container xs={12} sm={12} md={12} lg={12} spacing={1}>
        <Grid item xs={3} sm={3} md={3} lg={3} align="left">
            <Typography className={classes.blueText}>Sampling by  </Typography>
        </Grid>
        <Grid item xs={5} sm={5} md={5} lg={5} align="left">
            <SelectorItem id={'sampling'} value={samplingType} items={samplingList} onChange={(value) => setSamplingType(value)}></SelectorItem>
        </Grid>
        <Grid item  xs={4} sm={4} md={4} lg={4} align="left">
            <Button className={classes.confirmButton} onClick={()=>onSamplingData(samplingType)}><Typography className={classes.contentTextWhite}>Submit</Typography></Button>
        </Grid>
      </Grid>
  );
}

