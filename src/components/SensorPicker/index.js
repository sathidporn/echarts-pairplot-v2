// import papa from 'papaparse'
import React from 'react';
import Grid from '@mui/material/Grid'
import { Checkbox, Typography } from '@mui/material';
import { Table, TableContainer, TableHead, TableBody, TableRow, TableCell } from '@mui/material';
import { FormControlLabel } from '@mui/material';
import { useCallback, useState } from 'react';
import ImportSensorList from '../ImportSensorList';
import SensorCustomize from '../SensorCustomize';

// import ArrowDropDownCircleIcon from '@mui/icons-material/ArrowDropDownCircle';
import { style } from '../../styles/style';
const useStyles = style


export default function SensorPicker({ sensors, checkedSensors, raw, timestampsIndex, customize=false,  onPickedSensors = () => {}, onUpDateSensors = () => {}}) {
  const classes = useStyles();
  let [sensorList, setSensorList] = useState()
  const toggleSensors = useCallback ((tag,checked) => {
    let newSensors
    let newSensorsObj
    // make new sensor array
    if(checked){
      newSensors = [...checkedSensors, tag]
    }else{
      newSensors = checkedSensors.filter(sensor => sensor !== tag)
    }
    let index = sensors.findIndex(sensor => sensor.tag === tag)
    if (index !== -1) {
      newSensorsObj = [...sensors.slice(0, index), { ...sensors[index], checked: checked }, ...sensors.slice(index + 1)]
    } 
    onPickedSensors(tag, newSensors, newSensorsObj)

  },[checkedSensors, sensors, onPickedSensors])

  const onReadSensorListFile = useCallback((list) => {
    let updateSensors = []
    sensors.map((sensor, i) => {
      let index = list.findIndex(obj => obj.SENSOR_TAG === sensor.tag)
      if (index !== -1) {
        let newObj = {status: "available", tag: sensor.tag, checked: sensor.checked, name: list[index].SENSOR_NAME, description: list[index].SENSOR_DESCRIPTION, type: list[index].SENSOR_TYPE, unit: list[index].SENSOR_UNIT}
        updateSensors.push(newObj)
      }else{
        updateSensors = [...updateSensors.slice(0, i), { ...updateSensors[i], status: "unavailable", tag: sensor.tag, checked: sensor.checked, name: sensor.name, description: sensor.description, type: sensor.type, unit: sensor.unit }, ...updateSensors.slice(i + 1)]
      }
      return []
    })
    onUpDateSensors(updateSensors)
    setSensorList(list)
  },[sensors, setSensorList, onUpDateSensors])

  const onCustomizeSensors = useCallback((updateSensors) => {
    onUpDateSensors(updateSensors)
  },[onUpDateSensors])

  // const onRemoveSpecialSensor = useCallback((tag) => {})


  return (
    <div className="App">
      <Grid item container xs={12} sm={12} md={12} lg={12} spacing={1}>
        <Grid item xs={12} sm={12} md={12} lg={12}>
          <ImportSensorList onReadSensorListFile={onReadSensorListFile}></ImportSensorList>
        </Grid>
        <Grid item xs={12} sm={12} md={12} lg={12}>
          <TableContainer className={classes.tableContainer} >
            <Table size="small" stickyHeader>
              <TableHead>
                <TableRow>
                  <TableCell className={classes.tableCell}>SENSOR_TAG</TableCell>
                  {/* <TableCell align="left" className={classes.tableCell}>Sampling</TableCell> */}
                  <TableCell className={classes.tableCell}>SENSOR_NAME</TableCell>
                  <TableCell className={classes.tableCell}>SENSOR_DESCRIPTION</TableCell>
                  <TableCell className={classes.tableCell}>SENSOR_TYPE</TableCell>
                  <TableCell className={classes.tableCell}>SENSOR_UNIT</TableCell>
                  <TableCell className={classes.tableCell}>METHOD</TableCell>
                  <TableCell className={classes.tableCell}>COMPONENT_ID</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {sensors.map((sensor) => {
                  return(
                  <TableRow
                    key={sensor.tag}
                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                  >
                    <TableCell component="th" scope="row" className={classes.tableCell}>
                      <FormControlLabel 
                          control={<><Checkbox style={{color:"#51b4ec"}} size="small" checked={sensor.checked} onChange={(e)=> toggleSensors(sensor.tag,e.target.checked)} /> </>} 
                          label={<Typography className={classes.formControlLabel}>{sensor.tag}</Typography>}
                          className={classes.formControlLabel}
                          disabled={sensor.status === "unavailable"}
                      />
                    </TableCell>
                    <TableCell align="left" className={classes.tableCell}>
                      {sensor.name}
                    </TableCell>
                    <TableCell align="left" className={classes.tableCell}>
                      {sensor.description}
                    </TableCell>
                    <TableCell align="left" className={classes.tableCell}>
                      {sensor.type}
                    </TableCell>
                    <TableCell align="left" className={classes.tableCell}>
                      {sensor.unit}
                    </TableCell>
                    <TableCell align="left" className={classes.tableCell}>
                      {sensor.method}
                    </TableCell>
                    <TableCell align="left" className={classes.tableCell}>
                      {sensor.component}
                    </TableCell>
                  </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          </TableContainer>
        </Grid>
        <Grid item xs={12} sm={12} md={12} lg={12} align="right">
          <SensorCustomize sensors={sensors} onCustomizeSensors={onCustomizeSensors}></SensorCustomize>
        </Grid>
      </Grid>
    </div>
  );
}

