import * as React from 'react';
import { useCallback, useState, createRef } from 'react';
import { Grid, Typography } from '@mui/material';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip'
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import { TableContainer, Table, TableHead, TableBody, TableRow, TableCell } from '@mui/material';
import { Tooltip, IconButton } from '@mui/material';
import CancelIcon from '@mui/icons-material/Cancel'
import TextFieldItem from '../TextFieldItem'
import TableViewIcon from '@mui/icons-material/TableView';
import { CSVDownload, CSVLink } from 'react-csv'
import ImportSensorList from '../ImportSensorList';

import { style } from '../../styles/style';
const useStyles = style

let SENSOR_FILE_NAME = "sensor_list"
let SENSOR_HEADERS = [
    { label: "SENSOR_TAG", key: "tag" },
    { label: "SENSOR_NAME", key: "name" },
    { label: "SENSOR_DESCRIPTION", key: "description" },
    { label: "SENSOR_TYPE", key: "type" },
    { label: "SENSOR_UNIT", key: "unit" },
    { label: "METHOD", key: "method" },
    { label: "COMPONENT_ID", key: "component" },
]
let SPECIAL_FILE_NAME = "special_sensor_list"
let SPECIAL_HEADERS = [
    { label: "SPECIAL_TAG", key: "specialTag" },
    { label: "SPECIAL_NAME", key: "specialName" },
    { label: "DERIVED_FROM_TAG", key: "derivedFromTag" },
    { label: "DERIVE_FROM_NAME", key: "derivedFromName" },
    { label: "CAL_TYPE", key: "calType" },
    { label: "SUB_TYPE", key: "subType" },
    { label: "FROM_UNIT", key: "fromUnit" },
    { label: "TO_UNIT", key: "toUnit" },
    { label: "FACTOR", key: "factor" },
]

export default function SensorCustomize({sensors, onCustomizeSensors = () => {}, specialSensor=false, onRemoveSpecialSensor = () => {}, onUpdateSensors = () => {}, onUpdateSpecialSensors = () => {}}){
    const classes = useStyles();
    const [open, setOpen] = useState(false);
    const fullWidth = true
    const maxWidth = 'lg'

    console.log("sensors",sensors)

    const csvLinkEl = createRef()
  
    const handleClickOpen = () => {
      setOpen(true);
    };
  
    const handleClose = () => {
      setOpen(false);
    };

    const onChange = useCallback((tag, field, value) => {
        let index
        if(specialSensor === false){
            index = sensors.findIndex(sensor => sensor.tag === tag)  
        }else{
            index = sensors.findIndex(sensor => sensor.specialTag === tag)  
        }
        
        if (index !== -1) {
            if(field === "name"){
                onUpdateSensors([...sensors.slice(0, index), { ...sensors[index], name: value }, ...sensors.slice(index + 1)])
            }else if(field === "description"){
                onUpdateSensors([...sensors.slice(0, index), { ...sensors[index], description: value }, ...sensors.slice(index + 1)])
            }else if(field === "type"){
                onUpdateSensors([...sensors.slice(0, index), { ...sensors[index], type: value }, ...sensors.slice(index + 1)])   
            }else if(field === "unit"){
                onUpdateSensors([...sensors.slice(0, index), { ...sensors[index], unit: value }, ...sensors.slice(index + 1)])
            }else if(field === "component"){
                onUpdateSpecialSensors([...sensors.slice(0, index), { ...sensors[index], component: value }, ...sensors.slice(index + 1)])
            }else if(field === "specialName"){
                onUpdateSpecialSensors([...sensors.slice(0, index), { ...sensors[index], specialName: value }, ...sensors.slice(index + 1)])
            }else if(field === "derivedFromTag"){
                onUpdateSpecialSensors([...sensors.slice(0, index), { ...sensors[index], derivedFromTag: value }, ...sensors.slice(index + 1)])
            }else if(field === "derivedFromName"){
                onUpdateSpecialSensors([...sensors.slice(0, index), { ...sensors[index], derivedFromName: value }, ...sensors.slice(index + 1)])
            }else if(field === "calType"){
                onUpdateSpecialSensors([...sensors.slice(0, index), { ...sensors[index], calType: value }, ...sensors.slice(index + 1)])
            }else if(field === "subType"){
                onUpdateSpecialSensors([...sensors.slice(0, index), { ...sensors[index], subType: value }, ...sensors.slice(index + 1)])
            }else if(field === "fromUnit"){
                onUpdateSpecialSensors([...sensors.slice(0, index), { ...sensors[index], fromUnit: value }, ...sensors.slice(index + 1)])
            }else if(field === "toUnit"){
                onUpdateSpecialSensors([...sensors.slice(0, index), { ...sensors[index], toUnit: value }, ...sensors.slice(index + 1)])
            }else if(field === "factor"){
                onUpdateSpecialSensors([...sensors.slice(0, index), { ...sensors[index], factor: value }, ...sensors.slice(index + 1)])
            }           
        }
    },[sensors, specialSensor, onUpdateSpecialSensors, onUpdateSensors])

    // Get sensor list file
    const onReadSensorListFile = useCallback((list) => {
        if(list !== undefined){
            let sensorList = list.filter(sensor=>sensor.SENSOR_TAG !== "").map((sensor,i) => {
                let index = sensors.findIndex(obj => obj.tag === sensor.SENSOR_TAG)
                console.log("index",index)
                if(index !== -1){
                    return {
                        status: "available", 
                        tag: sensors[index].tag, 
                        checked: sensors[index].checked, 
                        name: sensor.SENSOR_NAME, 
                        description: sensor.SENSOR_DESCRIPTION, 
                        type: sensor.SENSOR_TYPE, 
                        unit: sensor.SENSOR_UNIT
                    }
                }else{
                    return{
                        status: "unavailable", 
                        tag: sensor.SENSOR_TAG, 
                        checked: false, 
                        name: sensor.SENSOR_NAME, 
                        description: sensor.SENSOR_DESCRIPTION, 
                        type: sensor.SENSOR_TYPE, 
                        unit: sensor.SENSOR_UNIT
                    }
                }
            })
            onUpdateSensors(sensorList)
            // setOpen(true)
            // setMessage("Sensor list file has uploaded successful.")
            console.log("onReadSensorListFile => ",  sensorList)
        }else{
            // setOpen(true)
            // setMessage("Please try again to upload sensor list file.")
            console.error("onReadSensorListFile => ", list)
        }
    },[sensors, onUpdateSensors])

      // Get special sensor file
  const onReadSpecialSensorListFile = useCallback((list) => {
    if(list !== undefined){
      let specialList = list.filter(sensor=>sensor.SPECIAL_TAG !== "").map(sensor => {
        return {
            specialTag: sensor.SPECIAL_TAG,
            specialName: sensor.SPECIAL_NAME,
            derivedFromTag: sensor.DERIVED_FROM_TAG,
            derivedFromName: sensor.DERIVE_FROM_NAME,
            calType: sensor.CAL_TYPE,
            subType: sensor.SUB_TYPE,
            fromUnit: sensor.FROM_UNIT,
            toUnit: sensor.TO_UNIT, 
            factor: sensor.FACTOR,
        }
      })
      onUpdateSpecialSensors(specialList)
      // setOpen(true)
      // setMessage("Special sensor list has uploaded successful.")
      console.log("onReadSpecialSensorListFile => ", specialList)
    }else{
      // setOpen(true)
      // setMessage("Please try again to upload special sensor list file.")
      console.error("onReadSpecialSensorListFile => ", list)
    }
  },[onUpdateSpecialSensors])

    return(
        <>
        <Button variant="outlined" className={classes.defaultButton} onClick={handleClickOpen}>
            <TableViewIcon className={classes.blackIcon}></TableViewIcon>
            <Typography className={classes.contentTextBlack}>View file</Typography>
        </Button>
        <Dialog
        fullWidth={fullWidth}
        maxWidth={maxWidth}
        open={open}
        onClose={handleClose}
        >
            <DialogTitle className={classes.dialog}>{specialSensor ? "Special Sensor File" : "Sensor File"}</DialogTitle>
            <DialogContent className={classes.dialog}>
                <Grid item container xs={12} sm={12} md={12} lg={12} spacing={1}>
                    <Grid item xs={12} sm={12} md={12} lg={8}>
                    {specialSensor === false &&
                    <ImportSensorList specialFile={false} onReadSensorListFile={onReadSensorListFile}></ImportSensorList>
                    }
                    {specialSensor === true &&
                    <ImportSensorList specialFile={true} onReadSensorListFile={onReadSpecialSensorListFile}></ImportSensorList>
                    }
                    </Grid>
                    <Grid item xs={12} sm={12} md={12} lg={12}>
                    <TableContainer className={classes.tableContainer} >
                    <Table size="small" stickyHeader>
                        <TableHead>
                        {!specialSensor &&
                        <TableRow key={"sensor"}>
                            <TableCell className={classes.tableCell}></TableCell>
                            <TableCell align="left" className={classes.tableCell}>SENSOR_TAG</TableCell>
                            <TableCell align="left" className={classes.tableCell}>SENSOR_NAME</TableCell>
                            <TableCell align="left" className={classes.tableCell}>SENSOR_DESCRIPTION</TableCell>
                            <TableCell align="left" className={classes.tableCell}>SENSOR_TYPE</TableCell>
                            <TableCell align="left" className={classes.tableCell}>SENSOR_UNIT</TableCell>
                            <TableCell align="left" className={classes.tableCell}>METHOD</TableCell>
                            <TableCell align="left" className={classes.tableCell}>COMPONENT_ID</TableCell>
                        </TableRow>
                        }
                        {specialSensor &&
                        <TableRow key={"special-sensor"}>
                            <TableCell className={classes.tableCell}></TableCell>
                            <TableCell align="left" className={classes.tableCell}>SPECIAL_TAG</TableCell>
                            <TableCell align="left" className={classes.tableCell}>SPECIAL_NAME</TableCell>
                            <TableCell align="left" className={classes.tableCell}>DERIVED_FROM_TAG</TableCell>
                            <TableCell align="left" className={classes.tableCell}>DERIVE_FROM_NAME</TableCell>
                            <TableCell align="left" className={classes.tableCell}>CAL_TYPE</TableCell>
                            <TableCell align="left" className={classes.tableCell}>SUB_TYPE</TableCell>
                            <TableCell align="left" className={classes.tableCell}>FROM_UNIT</TableCell>
                            <TableCell align="left" className={classes.tableCell}>TO_UNIT</TableCell>
                            <TableCell align="left" className={classes.tableCell}>FACTOR</TableCell>
                        </TableRow>
                        }
                        </TableHead>
                        {!specialSensor &&
                        <TableBody>
                        {sensors.map((sensor) => {
                            return(
                            <TableRow
                            key={sensor?.tag}
                            sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                            >
                                <TableCell component="th" scope="row" className={classes.tableCell}>
                                    {sensor.status === "new" &&
                                    <>
                                    <Chip label="New!" variant="outlined" className={classes.chip} />
                                    </>
                                    }
                                </TableCell>
                               
                                <TableCell component="th" scope="row" className={classes.tableCell}>
                                    {sensor.status === "new" &&
                                    <>
                                    <Tooltip title={"remove from list"} placement="top">
                                        <Typography className={classes.whiteText}>
                                            <IconButton  onClick={()=>onRemoveSpecialSensor(sensor.tag)}>
                                                <CancelIcon style={{fontSize:'1rem', color:"#f04461", borderRadius:5}}></CancelIcon>
                                            </IconButton>
                                            {sensor.tag}
                                        </Typography>
                                    </Tooltip>
                                    </>
                                    }
                                    {sensor.status !== "new" &&
                                    <>
                                    {sensor.tag}           
                                    </>
                                    }
                                </TableCell>
                                <TableCell align="left" className={classes.tableCell}>
                                    <TextFieldItem id={`${sensor.tag}-name`} type="text" value={sensor.name} onChange={(value) => onChange(sensor.tag, "name", value)}></TextFieldItem>
                                </TableCell>
                                <TableCell align="left" className={classes.tableCell}>
                                    <TextFieldItem id={`${sensor.tag}-description`} type="text" value={sensor.description} onChange={(value) => onChange(sensor.tag, "description", value)}></TextFieldItem>
                                </TableCell>
                                <TableCell align="left" className={classes.tableCell}>
                                    <TextFieldItem id={`${sensor.tag}-type`} type="text" value={sensor.type} onChange={(value) => onChange(sensor.tag, "type", value)}></TextFieldItem>
                                </TableCell>
                                <TableCell align="left" className={classes.tableCell}>
                                    <TextFieldItem id={`${sensor.tag}-unit`} type="text" value={sensor.unit} onChange={(value) => onChange(sensor.tag, "unit", value)}></TextFieldItem>
                                </TableCell>
                                <TableCell align="left" className={classes.tableCell}>
                                    <TextFieldItem id={`${sensor.tag}-method`} type="text" value={sensor.method}></TextFieldItem>
                                </TableCell>
                                <TableCell align="left" className={classes.tableCell}>
                                    <TextFieldItem id={`${sensor.tag}-component`} type="text" value={sensor.component} onChange={(value) => onChange(sensor.tag, "component", value)}></TextFieldItem>
                                </TableCell>
                            </TableRow>
                            )
                        })}
                        </TableBody>
                        }

                        {specialSensor &&
                        <TableBody>
                        {sensors.map((sensor, i) => {
                            return(
                            <TableRow
                            key={`${sensor?.specialTag}-${i}`}
                            sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                            >
                                
                                <TableCell component="th" scope="row" className={classes.tableCell}>
                                    {sensor.status === "new" &&
                                        <>
                                        <Chip label="New!" variant="outlined" className={classes.chip} />
                                        </>
                                    }
                                </TableCell>
                                
                                <TableCell component="th" scope="row" className={classes.tableCell}>
                                    {sensor.status === "new" &&
                                        <>
                                        <Tooltip title={"remove from list"} placement="top">
                                            <IconButton  onClick={()=>onRemoveSpecialSensor(sensor.specialTag)}>
                                                <CancelIcon style={{fontSize:'1rem', color:"#f04461", borderRadius:5}}></CancelIcon>
                                                <Typography className={classes.whiteText}>
                                                {sensor.specialTag}
                                                </Typography>
                                            </IconButton>
                                        </Tooltip>
                                        </>
                                        }
                                        {sensor.status !== "new" &&
                                        <>
                                        {sensor.specialTag}           
                                        </>
                                    }
                                </TableCell>
                                <TableCell align="left" className={classes.tableCell}>
                                    <TextFieldItem id={`${sensor.specialTag}-specialName`} type="text" value={sensor.specialName} onChange={(value) => onChange(sensor.specialTag, "specialName", value)}></TextFieldItem>
                                </TableCell>
                                <TableCell align="left" className={classes.tableCell}>
                                    <TextFieldItem id={`${sensor.specialTag}-derivedFromTag`} type="text" value={sensor.derivedFromTag} onChange={(value) => onChange(sensor.specialTag, "derivedFromTag", value)}></TextFieldItem>
                                </TableCell>
                                <TableCell align="left" className={classes.tableCell}>
                                    <TextFieldItem id={`${sensor.specialTag}-derivedFromName`} type="text" value={sensor.derivedFromName} onChange={(value) => onChange(sensor.specialTag, "derivedFromName", value)}></TextFieldItem>
                                </TableCell>
                                <TableCell align="left" className={classes.tableCell}>
                                    <TextFieldItem id={`${sensor.specialTag}-calType`} type="text" value={sensor.calType} onChange={(value) => onChange(sensor.specialTag, "calType", value)}></TextFieldItem>
                                </TableCell>
                                <TableCell align="left" className={classes.tableCell}>
                                    <TextFieldItem id={`${sensor.specialTag}-subType`} type="text" value={sensor.subType} onChange={(value) => onChange(sensor.specialTag, "subType", value)}></TextFieldItem>
                                </TableCell>
                                <TableCell align="left" className={classes.tableCell}>
                                    <TextFieldItem id={`${sensor.specialTag}-fromUnit`} type="text" value={sensor.fromUnit} onChange={(value) => onChange(sensor.specialTag, "fromUnit", value)}></TextFieldItem>
                                </TableCell>
                                <TableCell align="left" className={classes.tableCell}>
                                    <TextFieldItem id={`${sensor.specialTag}-toUnit`} type="text" value={sensor.toUnit} onChange={(value) => onChange(sensor.specialTag, "toUnit", value)}></TextFieldItem>
                                </TableCell>
                                <TableCell align="left" className={classes.tableCell}>
                                    <TextFieldItem id={`${sensor.specialTag}-factor`} type="text" value={sensor.factor} onChange={(value) => onChange(sensor.specialTag, "factor", value)}></TextFieldItem>
                                </TableCell>
                            </TableRow>
                            )
                        })}
                        </TableBody>
                        }
                    </Table>
                    </TableContainer>
                    </Grid>
                </Grid>
  
            </DialogContent>
            <DialogActions className={classes.dialog}>
                <Button className={classes.defaultButton}>
                    {/* <Typography className={classes.contentTextBlack}>Download CSV</Typography>
                    {download && */}
                    <CSVLink ref={csvLinkEl} data={sensors} headers={specialSensor ? SPECIAL_HEADERS : SENSOR_HEADERS} filename={specialSensor ? SPECIAL_FILE_NAME : SENSOR_FILE_NAME}>   
                    <Typography className={classes.contentTextBlack}>Download CSV</Typography>
                    </CSVLink>
                    {/* } */}
                </Button>
                <Button className={classes.defaultButton} onClick={handleClose}>
                    <Typography className={classes.contentTextBlack}>Close</Typography>
                </Button>
            </DialogActions>
        </Dialog>
      </>
    )
}