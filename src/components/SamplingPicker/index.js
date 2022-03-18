// import papa from 'papaparse'
import React from 'react';
import Grid from '@mui/material/Grid'
import { Typography, Select, MenuItem} from '@mui/material';
import ArrowDropDownCircleIcon from '@mui/icons-material/ArrowDropDownCircle';
import { style } from '../../styles/style';
const useStyles = style


export default function SamplingPicker({ sensorsObj, raw, timestampsIndex, onSamplingData = () => {}}) {
  const classes = useStyles();
//   const selectedSampling = useCallback ((type) => {
//     let newSeries = {}
//     sensorsObj.map((sensor) => {
//         let values = []
//         let result
//         for (let i = 0; i < timestampsIndex.length; i++) {
//             let start = timestampsIndex[i]
//             let end = timestampsIndex[i+1]
//             let valuesArr = raw[sensor.tag].slice(start,end)
//             result = samplingData({valuesArr, type})
//             values.push(result)
//         }
//         if(values){
//             let newObj = {}
//             newObj[sensor.tag] = values
//             newSeries = Object.assign(newSeries, newObj);
//         }
//         return values
//     })
//     onSamplingData(newSeries)
//   },[raw, sensorsObj, timestampsIndex, onSamplingData])

  return (
      <Grid item container xs={12} sm={12} md={12} lg={12} spacing={1}>
        <Grid item xs={4} sm={4} md={4} lg={4} align="left">
            <Typography className={classes.blueText}>SAMPLING TYPE :  </Typography>
        </Grid>
        <Grid item xs={8} sm={8} md={8} lg={8}>
            <Select
                IconComponent = {ArrowDropDownCircleIcon}
                onChange={(e)=>onSamplingData(e.target.value)}
                // onChange={(e)=>selectedSampling(e.target.value)}
                // value={diffType}
                className={classes.selector}  
                defaultValue={"select"}
                autoFocus={true}
                inputProps={{
                classes: {
                    root: classes.selector,
                    icon: classes.selector,
                },
                }}   
                MenuProps={{
                classes:{
                    list: classes.menuItem
                }
                }}     
            >
            <MenuItem value="select" className={classes.menuItem}>Select sampling</MenuItem>
            <MenuItem value="mean" className={classes.menuItem}>Mean</MenuItem>
            <MenuItem value="max" className={classes.menuItem}>Max</MenuItem>
            <MenuItem value="min" className={classes.menuItem}>Min</MenuItem>
            <MenuItem value="first" className={classes.menuItem}>First</MenuItem>
            <MenuItem value="last" className={classes.menuItem}>Last</MenuItem>
            </Select>
        </Grid>
      </Grid>
  );
}

