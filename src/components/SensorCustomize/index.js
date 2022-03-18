import * as React from 'react';
import { useCallback } from 'react';
import { Grid, Typography } from '@mui/material';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import { TableContainer, Table, TableHead, TableBody, TableRow, TableCell } from '@mui/material';
import { Tooltip, IconButton } from '@mui/material';
import CancelIcon from '@mui/icons-material/Cancel'
import TextFieldItem from '../TextFieldItem'

import { style } from '../../styles/style';
const useStyles = style

export default function SensorCustomize({sensors, onCustomizeSensors, specialSensor=false, onRemoveSpecialSensor = () => {} }){
    const classes = useStyles();
    const [open, setOpen] = React.useState(false);
    const fullWidth = true
    const maxWidth = 'lg'
  
    const handleClickOpen = () => {
      setOpen(true);
    };
  
    const handleClose = () => {
      setOpen(false);
    };

    const onChange = useCallback((tag, field, value) => {
        let index = sensors.findIndex(sensor => sensor.tag === tag)
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
            }    
        }
    },[sensors, onCustomizeSensors])

    return(
        <>
        <Button variant="outlined" className={classes.defaultButton} onClick={handleClickOpen}>
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
                    <Grid item xs={12} sm={12} md={12} lg={12}>
                    <TableContainer className={classes.tableContainer} >
                    <Table size="small" stickyHeader>
                        <TableHead>
                        {!specialSensor &&
                        <TableRow>
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
                        <TableRow>
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
                            key={sensor.tag}
                            sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                            >
                                <TableCell component="th" scope="row" className={classes.tableCell}>
                                {sensor.status === "new" &&
                                    <Tooltip title={"remove from list"} placement="top">
                                        <Typography className={classes.blueText}>
                                            <IconButton  onClick={()=>onRemoveSpecialSensor(sensor.SPECIAL_TAG)}>
                                                <CancelIcon style={{fontSize:'1rem', color:"#f04461", borderRadius:5}}></CancelIcon>
                                                <Typography className={classes.blueText}>in process for add remove function</Typography>
                                            </IconButton>
                                        </Typography>
                                    </Tooltip>
                                }
                                </TableCell>
                               
                                <TableCell component="th" scope="row" className={classes.tableCell}>
                                    {sensor.tag}
                                </TableCell>
                                <TableCell align="left" className={classes.tableCell}>
                                    <TextFieldItem id={`${sensor.tag}-name`} value={sensor.name} onChange={(value) => onChange(sensor.tag, "name", value)}></TextFieldItem>
                                </TableCell>
                                <TableCell align="left" className={classes.tableCell}>
                                    <TextFieldItem id={`${sensor.tag}-description`} value={sensor.description} onChange={(value) => onChange(sensor.tag, "description", value)}></TextFieldItem>
                                </TableCell>
                                <TableCell align="left" className={classes.tableCell}>
                                    <TextFieldItem id={`${sensor.tag}-type`} value={sensor.type} onChange={(value) => onChange(sensor.tag, "type", value)}></TextFieldItem>
                                </TableCell>
                                <TableCell align="left" className={classes.tableCell}>
                                    <TextFieldItem id={`${sensor.tag}-unit`} value={sensor.unit} onChange={(value) => onChange(sensor.tag, "unit", value)}></TextFieldItem>
                                </TableCell>
                                <TableCell align="left" className={classes.tableCell}>
                                    <TextFieldItem id={`${sensor.tag}-method`} value={sensor.method}></TextFieldItem>
                                </TableCell>
                                <TableCell align="left" className={classes.tableCell}>
                                    <TextFieldItem id={`${sensor.tag}-component`} value={sensor.component} onChange={(value) => onChange(sensor.tag, "component", value)}></TextFieldItem>
                                </TableCell>
                            </TableRow>
                            )
                        })}
                        </TableBody>
                        }

                        {specialSensor &&
                        <TableBody>
                        {sensors.map((sensor) => {
                            return(
                            <TableRow
                            key={sensor.tag}
                            sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                            >
                                
                                <TableCell component="th" scope="row" className={classes.tableCell}>
                                {sensor.status === "new" &&
                                    <Tooltip title={"remove from list"} placement="top">
                                        <Typography className={classes.blueText}>
                                            <IconButton onClick={()=>onRemoveSpecialSensor(sensor.SPECIAL_TAG)}>
                                                <CancelIcon style={{fontSize:'1rem', color:"#f04461", borderRadius:5}}></CancelIcon>
                                                <Typography className={classes.blueText}>new!</Typography>
                                            </IconButton>
                                        </Typography>
                                    </Tooltip>
                                }
                                </TableCell>
                                
                                <TableCell component="th" scope="row" className={classes.tableCell}>
                                    {sensor.SPECIAL_TAG}
                                </TableCell>
                                <TableCell align="left" className={classes.tableCell}>
                                    <TextFieldItem id={`${sensor.SPECIAL_TAG}-name`} value={sensor.SPECIAL_NAME}></TextFieldItem>
                                </TableCell>
                                <TableCell align="left" className={classes.tableCell}>
                                    <TextFieldItem id={`${sensor.SPECIAL_TAG}-derivedTag`} value={sensor.DERIVED_FROM_TAG}></TextFieldItem>
                                </TableCell>
                                <TableCell align="left" className={classes.tableCell}>
                                    <TextFieldItem id={`${sensor.SPECIAL_TAG}-deriveName`} value={sensor.DERIVE_FROM_NAME}></TextFieldItem>
                                </TableCell>
                                <TableCell align="left" className={classes.tableCell}>
                                    <TextFieldItem id={`${sensor.SPECIAL_TAG}-type`} value={sensor.CAL_TYPE}></TextFieldItem>
                                </TableCell>
                                <TableCell align="left" className={classes.tableCell}>
                                    <TextFieldItem id={`${sensor.SPECIAL_TAG}-subType`} value={sensor.SUB_TYPE}></TextFieldItem>
                                </TableCell>
                                <TableCell align="left" className={classes.tableCell}>
                                    <TextFieldItem id={`${sensor.SPECIAL_TAG}-fromUnit`} value={sensor.FROM_UNIT}></TextFieldItem>
                                </TableCell>
                                <TableCell align="left" className={classes.tableCell}>
                                    <TextFieldItem id={`${sensor.SPECIAL_TAG}-toUnit`} value={sensor.TO_UNIT}></TextFieldItem>
                                </TableCell>
                                <TableCell align="left" className={classes.tableCell}>
                                    <TextFieldItem id={`${sensor.SPECIAL_TAG}-factor`} value={sensor.FACTOR}></TextFieldItem>
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
                <Button className={classes.defaultButton} onClick={handleClose}>
                    <Typography className={classes.contentTextBlack}>Close</Typography>
                </Button>
            </DialogActions>
        </Dialog>
      </>
    )
}