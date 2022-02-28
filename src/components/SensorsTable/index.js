// import papa from 'papaparse'
import React from 'react';
import Grid from '@mui/material/Grid'
import { Checkbox, Typography, Select, MenuItem} from '@mui/material';
import { Table, TableContainer, TableHead, TableBody, TableRow, TableCell } from '@mui/material';
import { FormControlLabel } from '@mui/material';
import { useCallback } from 'react';
import ArrowDropDownCircleIcon from '@mui/icons-material/ArrowDropDownCircle';


import { style } from '../../styles/style';
import { samplingData } from '../../utils/data_sampling';
const useStyles = style


export default function SensorsData({ sensorsObj, checkedSensors, raw, timestampsIndex, onFilteredBySensors = () => {}}) {
  const classes = useStyles();
  // console.log("checkedSensors",checkedSensors)
  // change checked prop of sensor obj
  const toggleSensors = useCallback ((tag,checked) => {
    // console.log("toggle",tag,checked)
    let newSensors
    let newSensorsObj
    // make new sensor array
    if(checked){
      newSensors = [...checkedSensors, tag]
      // setSensorsArr(newSensors)
    }else{
      newSensors = checkedSensors.filter(sensor => sensor !== tag)
      // setSensorsArr(newSensors)
    }

    let index = sensorsObj.findIndex(sensor => sensor.tag === tag)
    if (index !== -1) {
      newSensorsObj = [...sensorsObj.slice(0, index), { ...sensorsObj[index], checked: checked }, ...sensorsObj.slice(index + 1)]
      // setSensorsObj([...sensorsObj.slice(0, index), { ...sensorsObj[index], checked: checked }, ...sensorsObj.slice(index + 1)])
    }

    // used mean sampling for default sensor series
    let values = []
    let value
    const average = (array) => array.reduce((a, b) => a + b) / array.length
    for (let i = 0; i < timestampsIndex.length; i++) {
        let start = timestampsIndex[i]
        let end = timestampsIndex[i+1]
        let valuesArr = raw[tag].slice(start,end)
        if(sensorsObj[index].sampling === "mean"){
          value = average(valuesArr)
        }else if(sensorsObj[index].sampling === "max"){
          value = Math.max(...valuesArr)
        }else if(sensorsObj[index].sampling === "min"){
          value = Math.min(...valuesArr);
        }
        values.push(value)
    }
    
    onFilteredBySensors(tag, values, newSensors, newSensorsObj)

  },[raw, checkedSensors, sensorsObj, timestampsIndex, onFilteredBySensors])

  // change sampling prop of sensor obj
  const selectedSampling = useCallback ((tag,type) => {
    let newSensorsObj
    let index = sensorsObj.findIndex(sensor => sensor.tag === tag)
    if (index !== -1) {
      newSensorsObj = [...sensorsObj.slice(0, index), { ...sensorsObj[index], sampling: type }, ...sensorsObj.slice(index + 1)]
      // setSensorsObj([...sensorsObj.slice(0, index), { ...sensorsObj[index], sampling: type }, ...sensorsObj.slice(index + 1)])
    }
    // used type to sampling sensor series
    let values = []
    let result
    for (let i = 0; i < timestampsIndex.length; i++) {
        let start = timestampsIndex[i]
        let end = timestampsIndex[i+1]
        let valuesArr = raw[tag].slice(start,end)
        result = samplingData({valuesArr, type})
        values.push(result)
    }
    if(sensorsObj[index].checked === true) {
      onFilteredBySensors(tag, values, checkedSensors, newSensorsObj)
    }
  },[raw, checkedSensors, sensorsObj, timestampsIndex, onFilteredBySensors])

  return (
    <div className="App">
      <Grid item container xs={12} sm={12} md={12} lg={12} spacing={1}>
        <Grid item xs={12} sm={12} md={12} lg={12}>
        <TableContainer className={classes.tableContainer} >
          <Table size="small" stickyHeader>
            <TableHead>
              <TableRow>
                <TableCell className={classes.tableCell}>Sensor</TableCell>
                <TableCell align="left" className={classes.tableCell}>Sampling</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {sensorsObj.map((sensor) => {
                return(
                <TableRow
                  key={sensor.tag}
                  sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                >
                  <TableCell component="th" scope="row" className={classes.tableCell}>
                    {/* <TextField type="checkbox" checked={sensor.checked} onChange={(e)=> toggleSensors(sensor.tag,e.target.checked)}/>{sensor.tag} */}
                    <FormControlLabel 
                        control={<><Checkbox style={{color:"#51b4ec"}} size="small" checked={sensor.checked} onChange={(e)=> toggleSensors(sensor.tag,e.target.checked)} /> </>} 
                        label={<Typography className={classes.formControlLabel}>{sensor.tag}</Typography>}
                        className={classes.formControlLabel}
                    />
                  </TableCell>
                  <TableCell align="left" className={classes.tableCell}>
                  {sensor.checked === true &&
                    <Select
                      IconComponent = {ArrowDropDownCircleIcon}
                      onChange={(e)=>selectedSampling(sensor.tag, e.target.value)}
                      // value={diffType}
                      className={classes.selector}  
                      defaultValue={"mean"}
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
                    <MenuItem value="mean" className={classes.menuItem}>Mean</MenuItem>
                    <MenuItem value="max" className={classes.menuItem}>Max</MenuItem>
                    <MenuItem value="min" className={classes.menuItem}>Min</MenuItem>
                    <MenuItem value="first" className={classes.menuItem}>First</MenuItem>
                    <MenuItem value="last" className={classes.menuItem}>Last</MenuItem>
                    </Select>
                  }
                  </TableCell>
                
                </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </TableContainer>

        </Grid>
      </Grid>
    </div>
  );
}

