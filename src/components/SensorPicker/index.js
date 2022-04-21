// import papa from 'papaparse'
import React from 'react';
import Grid from '@mui/material/Grid'
import { Checkbox, Typography } from '@mui/material';
import { Table, TableContainer, TableHead, TableBody, TableRow, TableCell } from '@mui/material';
import { FormControlLabel } from '@mui/material';
import { useCallback } from 'react';
import SensorCustomize from '../SensorCustomize';
import { style } from '../../styles/style';
const useStyles = style


export default function SensorPicker({ sensors, checkedSensors, onPickedSensors = () => {}, onUpdateSensors = () => {}, onRemoveSpecialSensor = () => {}, onReadSensorListFile = () => {}}) {
  const classes = useStyles();
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

  return (
    <div className="App">
      <Grid item container xs={12} sm={12} md={12} lg={12} spacing={1}>
        {/* <Grid item xs={12} sm={12} md={12} lg={12}>
          <ImportSensorList onReadSensorListFile={onReadSensorListFile}></ImportSensorList>
        </Grid> */}
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
                          control={<><Checkbox style={{color:"#51b4ec"}} size="small" checked={sensor.checked} disabled={sensor.status === "unavailable" ? true : false} onChange={(e)=> toggleSensors(sensor.tag,e.target.checked)} /> </>} 
                          label={<Typography className={classes.formControlLabel}>{sensor.tag}</Typography>}
                          className={classes.formControlLabel}
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
          <SensorCustomize sensors={sensors} specialSensor={false} onUpdateSensors={onUpdateSensors} onRemoveSpecialSensor={onRemoveSpecialSensor} onReadSensorListFile={onReadSensorListFile}></SensorCustomize>
        </Grid>
      </Grid>
    </div>
  );
}

