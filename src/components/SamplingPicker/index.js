// import papa from 'papaparse'
import React, { useCallback, useState } from 'react';
import Grid from '@mui/material/Grid'
import { Typography } from '@mui/material';
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
  const handleChange = useCallback((value) => {
    setSamplingType(value)
    onSamplingData(value)
  }, [setSamplingType, onSamplingData])
  return (
      <Grid item container xs={12} sm={12} md={12} lg={12} spacing={1}>
        <Grid item xs={4} sm={4} md={4} lg={4} align="left">
            <Typography className={classes.blueText}>SAMPLING TYPE :  </Typography>
        </Grid>
        <Grid item xs={8} sm={8} md={8} lg={8}>
          <SelectorItem id={'sampling'} value={samplingType} items={samplingList} onChange={(value) => handleChange(value)}></SelectorItem>
        </Grid>
      </Grid>
  );
}

