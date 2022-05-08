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
import { CSVLink } from 'react-csv'
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

export default function SensorCustomize({sensors, specialSensor=false, onRemoveSpecialSensor = () => {}, onCustomizeSensors = () => {}, onReadSensorListFile = () => {}, onReadSpecialSensorListFile = () => {}}){
    const classes = useStyles();
    const [open, setOpen] = useState(false);
    const fullWidth = true
    const maxWidth = 'xxs'
    const csvLinkEl = createRef()

    console.log("sensors",sensors, specialSensor)

    const [edit, setEdit] = useState(false)

    const handleEdit = useCallback(() => {
        setEdit(!edit)
    },[setEdit, edit])
  
    const handleClickOpen = () => {
      setOpen(true);
    };
  
    const handleClose = () => {
      setOpen(false);
      setEdit(false)
    };

    const onChange = (tag, field, value) => {
        let index
        if(specialSensor === false){
            index = sensors.findIndex(sensor => sensor.tag === tag)  
        }else{
            index = sensors.findIndex(sensor => sensor.specialTag === tag)  
        }
        
        if (index !== -1) {
            if(field === "name"){
                onCustomizeSensors([...sensors.slice(0, index), { ...sensors[index], name: value }, ...sensors.slice(index + 1)])
            }else if(field === "description"){
                onCustomizeSensors([...sensors.slice(0, index), { ...sensors[index], description: value }, ...sensors.slice(index + 1)])
            }else if(field === "type"){
                onCustomizeSensors([...sensors.slice(0, index), { ...sensors[index], type: value }, ...sensors.slice(index + 1)])   
            }else if(field === "unit"){
                onCustomizeSensors([...sensors.slice(0, index), { ...sensors[index], unit: value }, ...sensors.slice(index + 1)])
            }else if(field === "component"){
                onCustomizeSensors([...sensors.slice(0, index), { ...sensors[index], component: value }, ...sensors.slice(index + 1)])
            }else if(field === "specialName"){
                onCustomizeSensors([...sensors.slice(0, index), { ...sensors[index], specialName: value }, ...sensors.slice(index + 1)])
            }else if(field === "derivedFromTag"){
                onCustomizeSensors([...sensors.slice(0, index), { ...sensors[index], derivedFromTag: value }, ...sensors.slice(index + 1)])
            }else if(field === "derivedFromName"){
                onCustomizeSensors([...sensors.slice(0, index), { ...sensors[index], derivedFromName: value }, ...sensors.slice(index + 1)])
            }else if(field === "calType"){
                onCustomizeSensors([...sensors.slice(0, index), { ...sensors[index], calType: value }, ...sensors.slice(index + 1)])
            }else if(field === "subType"){
                onCustomizeSensors([...sensors.slice(0, index), { ...sensors[index], subType: value }, ...sensors.slice(index + 1)])
            }else if(field === "fromUnit"){
                onCustomizeSensors([...sensors.slice(0, index), { ...sensors[index], fromUnit: value }, ...sensors.slice(index + 1)])
            }else if(field === "toUnit"){
                onCustomizeSensors([...sensors.slice(0, index), { ...sensors[index], toUnit: value }, ...sensors.slice(index + 1)])
            }else if(field === "factor"){
                onCustomizeSensors([...sensors.slice(0, index), { ...sensors[index], factor: value }, ...sensors.slice(index + 1)])
            }           
        }
    }

    const CustomTableCell = ({id, value, onChange}) => {
        return(
            <TableCell key={id} align="left" className={classes.tableCell}>
                <Tooltip title={value} placement="top">
                {edit ? (
                    <TextFieldItem id={id} type="text" value={value} onChange={(value) => onChange(value)}></TextFieldItem>
                ):
                (
                    <Typography className={classes.whiteText}>{value}</Typography>
                )}
                </Tooltip>
            </TableCell>
        )
    }

    return(
        <>
        <Button variant="outlined" className={classes.defaultButton} onClick={handleClickOpen}>
            {/* <TableViewIcon className={classes.blackIcon}></TableViewIcon> */}
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
                    <Grid item xs={12} sm={12} md={12} lg={4}>
                    {specialSensor === true ? (
                        <ImportSensorList specialFile={true} onReadSpecialSensorListFile={onReadSpecialSensorListFile}></ImportSensorList>

                    ):(
                        <ImportSensorList specialFile={false} onReadSensorListFile={onReadSensorListFile}></ImportSensorList>
                    )}
                    </Grid>
                    <Grid item xs={12} sm={12} md={12} lg={12} align="right">
                        <Button className={classes.defaultButton} onClick={handleEdit}><Typography className={classes.contentTextWhite}>Edit File</Typography></Button>
                    </Grid>
                    <Grid item xs={12} sm={12} md={12} lg={12}>
                    <TableContainer className={classes.tableContainer} >
                    <Table size="small" stickyHeader>
                        <TableHead>
                        {specialSensor === false ? (
                            <TableRow key={"sensor"}>
                                 <TableCell key={"label"} align="left" className={classes.tableHead}></TableCell>  
                                {SENSOR_HEADERS.map((sensor) => {
                                    return(
                                        <TableCell key={sensor.label} align="left" className={classes.tableHead}>{sensor.label}</TableCell>  
                                    ) 
                                })}
                            </TableRow>
                        ):(
                            <TableRow key={"special-sensor"}>
                                <TableCell key={"label"} align="left" className={classes.tableHead}></TableCell>  
                                {SPECIAL_HEADERS.map((sensor) => {
                                    return(
                                        <TableCell key={sensor.label} align="left" className={classes.tableHead}>{sensor.label}</TableCell>  
                                    ) 
                                })}
                            </TableRow>

                        )}
                        </TableHead>

                        {specialSensor === false ? (
                            <TableBody>
                                {sensors.map((sensor) => {
                                    return(
                                    <TableRow
                                    key={sensor?.tag}
                                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                    >
                                        <TableCell key={`${sensor.tag}-label`} component="th" scope="row" className={classes.tableCell}>
                                            <Chip label={sensor.status === "new" ? "new" : "origin"} variant="outlined" className={classes.chip} />
                                            {sensor.status === "new" &&
                                            <IconButton  onClick={()=>onRemoveSpecialSensor(sensor.tag)}>
                                                <CancelIcon style={{fontSize:'1rem', color:"#f04461", borderRadius:5}}></CancelIcon>
                                            </IconButton>
                                            }
                                        </TableCell>
                                        <TableCell key={`${sensor.tag}-tag`} component="th" scope="row" className={classes.tableCell}>
                                            <Tooltip title={sensor.tag} placement="top">
                                                <Typography className={classes.whiteText}>
                                                    {sensor.tag.length > 20 ? `${sensor.tag.substring(0,20)}...` : `${sensor.tag}`}   
                                                </Typography>
                                            </Tooltip>       
                                        </TableCell>
                                        <CustomTableCell id={`${sensor.tag}-name`} value={sensor.name} onChange={(value) => onChange(sensor.tag, "name", value)}></CustomTableCell>
                                        <CustomTableCell id={`${sensor.tag}-description`} value={sensor.description} onChange={(value) => onChange(sensor.tag, "description", value)}></CustomTableCell>
                                        <CustomTableCell id={`${sensor.tag}-type`} value={sensor.type} onChange={(value) => onChange(sensor.tag, "type", value)}></CustomTableCell>
                                        <CustomTableCell id={`${sensor.tag}-unit`} value={sensor.unit} onChange={(value) => onChange(sensor.tag, "unit", value)}></CustomTableCell>
                                        <CustomTableCell id={`${sensor.tag}-method`} value={sensor.method}></CustomTableCell>
                                        <CustomTableCell id={`${sensor.tag}-component`} value={sensor.component} onChange={(value) => onChange(sensor.tag, "component", value)}></CustomTableCell>
                                    </TableRow>
                                    )
                                })}
                            </TableBody>
                        ):(
                            <TableBody>
                                {sensors.map((sensor, i) => {
                                    return(
                                    <TableRow
                                    key={`${sensor?.specialTag}-${i}`}
                                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                    >
                                        <TableCell key={`${sensor.tag}-label`} component="th" scope="row" className={classes.tableCell}>
                                            <Chip label={sensor.status === "new" ? "new" : "origin"} variant="outlined" className={classes.chip} />
                                            {sensor.status === "new" &&
                                            <IconButton  onClick={()=>onRemoveSpecialSensor(sensor.specialTag)}>
                                                <CancelIcon style={{fontSize:'1rem', color:"#f04461", borderRadius:5}}></CancelIcon>
                                            </IconButton>
                                            }
                                        </TableCell>
                                        <TableCell key={`${sensor.tag}-tag`} component="th" scope="row" className={classes.tableCell}>
                                            <Tooltip title={sensor.specialTag} placement="top">
                                                <Typography className={classes.whiteText}>
                                                    {sensor.specialTag.length > 20 ? `${sensor.specialTag.substring(0,20)}...` : `${sensor.specialTag}`}
                                                </Typography> 
                                            </Tooltip>        
                                        </TableCell>
                                        <CustomTableCell id={`${sensor.specialTag}-specialName`} value={sensor.specialName} onChange={(value) => onChange(sensor.specialTag, "specialName", value)}></CustomTableCell>
                                        <CustomTableCell id={`${sensor.specialTag}-derivedFromTag`} value={sensor.derivedFromTag} onChange={(value) => onChange(sensor.specialTag, "derivedFromTag", value)}></CustomTableCell>
                                        <CustomTableCell id={`${sensor.specialTag}-derivedFromName`} value={sensor.derivedFromName} onChange={(value) => onChange(sensor.specialTag, "derivedFromName", value)}></CustomTableCell>
                                        <CustomTableCell id={`${sensor.specialTag}-calType`} value={sensor.calType} onChange={(value) => onChange(sensor.specialTag, "calType", value)}></CustomTableCell>
                                        <CustomTableCell id={`${sensor.specialTag}-subType`} value={sensor.subType} onChange={(value) => onChange(sensor.specialTag, "subType", value)}></CustomTableCell>
                                        <CustomTableCell id={`${sensor.specialTag}-fromUnit`} value={sensor.fromUnit} onChange={(value) => onChange(sensor.specialTag, "fromUnit", value)}></CustomTableCell>
                                        <CustomTableCell id={`${sensor.specialTag}-toUnit`} value={sensor.toUnit} onChange={(value) => onChange(sensor.specialTag, "toUnit", value)}></CustomTableCell>
                                        <CustomTableCell id={`${sensor.specialTag}-factor`} value={sensor.factor} onChange={(value) => onChange(sensor.specialTag, "factor", value)}></CustomTableCell>
                                    </TableRow>
                                    )
                                })}
                            </TableBody>
                        )}
                    </Table>
                    </TableContainer>
                    </Grid>
                </Grid>
            </DialogContent>
            <DialogActions className={classes.dialog}>
                <Button className={classes.defaultButton}>
                    <CSVLink ref={csvLinkEl} data={sensors} headers={specialSensor ? SPECIAL_HEADERS : SENSOR_HEADERS} filename={specialSensor ? SPECIAL_FILE_NAME : SENSOR_FILE_NAME}>   
                    <Typography className={classes.contentTextBlack}>Download CSV</Typography>
                    </CSVLink>
                </Button>
                <Button className={classes.defaultButton} onClick={handleClose}>
                    <Typography className={classes.contentTextBlack}>Close</Typography>
                </Button>
            </DialogActions>
        </Dialog>
      </>
    )
}