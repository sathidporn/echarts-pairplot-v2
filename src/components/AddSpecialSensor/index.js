import React from 'react';
import Grid from '@mui/material/Grid'
import { useCallback, useState }  from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Table, TableContainer, TableHead, TableBody, TableRow, TableCell, Typography, Button, IconButton, Tooltip } from '@mui/material';
// import ArrowDropDownCircleIcon from '@mui/icons-material/ArrowDropDownCircle';
import CancelIcon from '@mui/icons-material/Cancel'
import { style } from '../../styles/style';
import SensorCustomize from '../SensorCustomize';

import { generateSensorTag, maximumSensorSelection } from '../../utils/calculate_sensor';
import TextFieldItem from '../TextFieldItem';
import SelectorItem from '../SelectorItem';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import { max } from 'date-fns';

import DialogMessage from '../DialogMessage';

const useStyles = style

const calculationList = [{value:"select", name: "Select calculation", symbol: ""}, {value:"ADD", name: "Add", symbol: "+"}, {value:"ABSDIFF", name: "Absolute Diff", symbol: "-"}, {value:"MUL", name: "Multiply", symbol: "*"}, {value:"DIV", name: "Divide", symbol: "/"}, {value:"AVG", name: "Average", symbol: "+"}]     

export default function AddSpecialSensor({ sensors, specialSensors, onAddSpecialSensor=()=>{}, onCustomizeSensors=()=>{},  onRemoveSpecialSensor = () => {}, onReadSpecialSensorListFile = () => {}}){
    const classes = useStyles()
    let [showMessage, setShowMessage] = useState(false)
    let [message, setMessage] = useState()
    const handleCloseDialog = () => {
        setShowMessage(false)
    }
    
    let [selected, setSelected] = useState([])
    let [constantState, setConstantState] = useState(false)
    let [newSensor, setNewSensor] = useState({sensors: [], maxSensor: 0, calType: "select", constant: "", tag: "", name: ""})

    // Handle calculation type
    const handleChangeCalType = useCallback((type) => {
        if(type !== newSensor.calType){
            let tag = generateSensorTag({derivedSensors: newSensor.sensors, calType: type})
            let max = maximumSensorSelection({calType: type, constant: false})
            setNewSensor({...newSensor, sensors: [], maxSensor: max, calType: type, constant: "", tag: tag, name: ""})
            console.log("newSensor", newSensor)
        }
    }, [newSensor, setNewSensor])

    // Add sensor to calculate
    const onAddSensor = useCallback((curSensor) => {
        let index = newSensor.sensors.findIndex(sensor => sensor.tag === curSensor.tag)
        if(newSensor.sensors.length < newSensor.maxSensor && index === -1){
            let sensors = [ ...newSensor.sensors, curSensor]
            setSelected([...selected, curSensor.tag])
            let tag = generateSensorTag({derivedSensors: sensors, calType: newSensor.calType})
            setNewSensor({...newSensor, sensors: sensors, tag: tag})
        }else{
            if(newSensor.calType !== "select"){
                setMessage(`Max sensors is ${newSensor.maxSensor}`)
                setShowMessage(true)
            }else{
                setMessage(`Please select calculation.`)
                setShowMessage(true)
            }
        }
    },[newSensor, selected, setSelected, setNewSensor, setMessage, setShowMessage])

    // Add constant to calculate
    const onAddConstant = useCallback(() => {
        setConstantState(true)
        let max = maximumSensorSelection({calType: newSensor.calType, constant: true})
        setNewSensor({...newSensor, maxSensor: max, constant: undefined})
    },[newSensor, setConstantState, setNewSensor])

    // Remove constant
    const onRemoveConstant = useCallback(() => {
        setConstantState(false)
        let max = maximumSensorSelection({calType: newSensor.calType, constant: false})
        setNewSensor({...newSensor, maxSensor: max, constant: ""})
    },[newSensor, setConstantState, setNewSensor])

    // Remove sensor to calculate
    const onRemoveSensor = useCallback((curSensor) => {
        let sensors = newSensor.sensors.filter(sensor=>sensor.tag !== curSensor.tag)
        let tag = generateSensorTag({derivedSensors: sensors, calType: newSensor.calType})
        setNewSensor({...newSensor, sensors: sensors, tag: tag})
    },[newSensor, setNewSensor])

    // Generate new special sensor
    const onGenerateSensor = useCallback(() => {
        if(newSensor.sensors && newSensor.tag && newSensor.calType){
            let objNewSensor = {sensor: newSensor.sensors, tag: newSensor.tag, name: newSensor.name, calType: newSensor.calType, constant: newSensor.constant}
            setConstantState(false)
            setNewSensor({sensors: [], tag: "", name: "", calType: "select"})

            let updateSpecialSensors = specialSensors
            for(let i=0; i<newSensor.sensors.length; i++){
                let objNew = {status: "new", specialTag: newSensor.tag, specialName: newSensor.name, derivedFromTag: newSensor.sensors[i].tag, derivedFromName: newSensor.sensors[i].name, calType: newSensor.calType, subType: "", fromUnit: "", toUnit: "", factor: newSensor.constant}
                updateSpecialSensors.push(objNew)
            }
            onCustomizeSensors(updateSpecialSensors)
            onAddSpecialSensor(objNewSensor)
            setShowMessage(true)
            setMessage("Special sensor has been added successfully.")
        }else{
            // onAddSpecialSensor(undefined)
            setShowMessage(true)
            setMessage("Failed to add special sensor.")
        }
    },[newSensor, specialSensors, onCustomizeSensors, onAddSpecialSensor, setConstantState, setNewSensor, setShowMessage, setMessage])

    const [open, setOpen] = useState(false);
    const fullWidth = true
    const maxWidth = 'md'
    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    return(
        <>

        <Button variant="outlined" className={classes.defaultButton} fullWidth onClick={handleClickOpen}>
            {/* <TableViewIcon className={classes.blackIcon}></TableViewIcon> */}
            <Typography className={classes.contentTextBlack}>Add Special Sensor</Typography>
        </Button>
        <Dialog
        fullWidth={fullWidth}
        maxWidth={maxWidth}
        open={open}
        onClose={handleClose}
        >
            <DialogTitle className={classes.dialog}>Add special sensor</DialogTitle>
            <DialogContent className={classes.dialog}>
            <Grid item container xs={12} sm={12} md={12} lg={12} spacing={1}>
                <Grid item container xs={12} sm={12} md={12} lg={12} spacing={1}>
                    <Grid item xs={3} sm={3} md={3} lg={3}>
                        <Typography className={classes.blueText}>CALCULATION : </Typography>
                    </Grid>
                    <Grid item xs={9} sm={9} md={9} lg={9}>
                        <SelectorItem id={'calType'} value={newSensor.calType} items={calculationList} onChange={(value) => handleChangeCalType(value)}></SelectorItem>
                    </Grid>
                </Grid>

                <Grid item xs={12} sm={12} md={12} lg={12}>
                    <TableContainer className={classes.tableContainer} style={{height: '30vh'}}>
                        <Table size="small" stickyHeader aria-label="sticky table">
                            <TableHead>
                            <TableRow>
                                <TableCell align="left" className={classes.tableCell}></TableCell>
                                <TableCell className={classes.tableCell}>SENSOR_TAG</TableCell>
                            </TableRow>
                            </TableHead>
                            <TableBody>
                            {sensors.filter(sensor=> selected.indexOf(sensor.tag) === -1).map((sensor) => {
                                return(
                                <TableRow
                                    key={sensor.tag}
                                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                >
                                    <TableCell align="left"  className={classes.tableCell}>
                                        <Button onClick={()=>onAddSensor({tag: sensor.tag, name: sensor.name})} className={classes.defaultButton}>
                                            <Typography className={classes.contentTextBlack}>Select</Typography>
                                        </Button>
                                    </TableCell>
                                    <TableCell component="th" scope="row" className={classes.tableCell}>
                                        <Typography className={classes.formControlLabel}>{sensor.tag}</Typography>
                                    </TableCell>
                                </TableRow>
                                )
                            })}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Grid>
                
                <Grid item xs={12} sm={12} md={12} lg={12} align="right">
                    <SensorCustomize sensors={specialSensors} specialSensor={true} onCustomizeSensors={onCustomizeSensors} onRemoveSpecialSensor={onRemoveSpecialSensor} onReadSpecialSensorListFile={onReadSpecialSensorListFile}></SensorCustomize>
                </Grid>

                <Grid item container xs={12} sm={12} md={12} lg={12} align="left">
                    <Grid item xs={3} sm={3} md={3} lg={3}>
                        <Typography className={classes.blueText}>SELECTED SENSOR : </Typography>
                    </Grid>
                    <Grid item container xs={9} sm={9} md={9} lg={9} style={{backgroundColor: '#454c54', borderRadius: 15, minHeight: '5vh'}}>
                    {newSensor.sensors.map((sensor,i) => {
                        return(
                        <Grid key={sensor.tag} item container xs={12} sm={12} md={12} lg={12} spacing={0} style={{paddingLeft: 10}}>
                                <Tooltip title={sensor.tag ? sensor.tag : "-"} placement="top">
                                    <Typography className={classes.whiteText}>
                                        {sensor.tag.length > 40 ? `${sensor.tag.substring(0,40)}...` : `${sensor.tag}`}
                                        <IconButton onClick={()=>onRemoveSensor(sensor)} >
                                            <CancelIcon style={{fontSize:'1rem', color:"#f04461", borderRadius:5}}></CancelIcon>
                                        </IconButton>
                                    </Typography>
                                </Tooltip>
                        </Grid>  
                        )
                    })}
                    </Grid>
                    <Grid item lg={12} align="right">
                        <Typography className={classes.whiteText}>
                        {selected.length}/{newSensor.maxSensor}
                        </Typography>
                    </Grid>
                </Grid>

                <Grid item container xs={12} sm={12} md={12} lg={12} align="left">
                    <Grid item xs={3} sm={3} md={3} lg={3}>
                        <Typography className={classes.blueText}>FORMULA : </Typography>
                    </Grid>
                    <Grid item  xs={9} sm={9} md={9} lg={9} align="left">
                    <Grid item container xs={12} sm={12} md={12} lg={12} style={{backgroundColor: '#454c54', borderRadius: 15, minHeight: '5vh'}} spacing={0}>
                    {newSensor.sensors.map((sensor,i) => {
                        return(
                        <Grid item xs={4} sm={4} md={4} lg={3} style={{paddingLeft: 10}}>
                            <Grid item container xs={12} sm={12} md={12} lg={12} spacing={0} direction="row" flexWrap="wrap">
                                {/* show ( symbol */}
                                {i === 0 && newSensor.sensors.length > 1 && newSensor.calType === "AVG" &&
                                <Grid item xs={1} sm={1} md={1} lg={1} align="left">
                                    <Typography className={classes.whiteText}>
                                    (
                                    </Typography>
                                </Grid>
                                }

                                
                                {/* show sensor tag */}
                                <Grid item  xs={6} sm={6} md={6} lg={8} align="left">
                                    <Typography className={classes.whiteText}>
                                        {sensor.tag.length > 40 ? `${sensor.tag.substring(0,40)}...` : `${sensor.tag}`}
                                    </Typography>
                                </Grid>

                                {/* show calculation symbol */}
                                {i !== newSensor.sensors.length-1  && newSensor.sensors.length > 1 &&
                                <Grid item xs={1} sm={1} md={1} lg={1} align="right">
                                    <Typography className={classes.whiteText}>
                                        {calculationList.find(cal => cal.value === newSensor.calType).symbol}
                                    </Typography>
                                </Grid>
                                }

                                {/* show ) symbol */}
                                {i === newSensor.sensors.length-1 && newSensor.sensors.length > 1 && newSensor.calType === "AVG" &&
                                <Grid item xs={1} sm={1} md={1} lg={1} align="right">
                                    <Typography className={classes.whiteText}>
                                    )
                                    </Typography>
                                </Grid>
                                }

                                {/* show constant */}
                                {i === newSensor.sensors.length-1 && newSensor.constant !== "" && newSensor.calType !== "AVG" &&
                                <Grid item xs={3} sm={3} md={3} lg={3} align="left">
                                    <Typography className={classes.whiteText}>
                                        {calculationList.find(cal => cal.value === newSensor.calType).symbol} {newSensor.constant} 
                                    </Typography>
                                </Grid>
                                }

                                {/* show constant for avg */}
                                {i === newSensor.sensors.length-1 && newSensor.sensors.length > 1 && newSensor.calType === "AVG" && 
                                <Grid item xs={3} sm={3} md={3} lg={3} align="left">
                                    <Typography className={classes.whiteText}>
                                        / {newSensor.sensors.length}
                                    </Typography>
                                </Grid>
                                }

                            </Grid>  
                        </Grid>
                        )
                    })}
                    </Grid>
                    </Grid>
                </Grid>

                {/* {newSensor.calType !== "AVG" && ((newSensor.calType !== "ABSDIFF" || newSensor.calType !== "MUL") && newSensor.sensors.length !== 2) &&  */}
                {newSensor.calType === "DIV" && newSensor.sensors.length !== 2 && 
                <Grid item container xs={12} sm={12} md={12} lg={12} align="left" >
                    {constantState === false &&
                    <>
                    <Grid item xs={3} sm={3} md={3} lg={3}>
                        <Typography className={classes.blueText}>CONSTANT : </Typography>
                    </Grid>
                    <Grid item xs={9} sm={9} md={9} lg={9} alignContent="right" alignItems="right" alignSelf="right">
                        <Button className={classes.defaultButton} onClick={()=>onAddConstant()}>
                            {/* <AddCircleOutlineIcon className={classes.blackIcon}></AddCircleOutlineIcon> */}
                            <Typography className={classes.contentTextBlack}> Add Constant</Typography>
                        </Button>
                    </Grid>
                    </>
                    }
                    {constantState === true && 
                    <>
                    <Grid item xs={3} sm={3} md={3} lg={3}>
                        <Typography className={classes.blueText}>CONSTANT : </Typography>
                    </Grid>
                    {/* <Grid item xs={3} sm={3} md={3} lg={3}>
                        <SelectorItem id={'calType'} value={newSensor.calType} items={calculationList} onChange={(value) => handleChangeCalType(value)}></SelectorItem>
                    </Grid> */}
                    <Grid item xs={6} sm={6} md={6} lg={6}>
                        <TextFieldItem id={`constant`} type="number" value={newSensor.constant} onChange={(value) => setNewSensor({...newSensor, constant: value})} defaultValue={false}></TextFieldItem>
                    </Grid>
                    <Grid item xs={3} sm={3} md={3} lg={3}>
                        <IconButton onClick={()=>onRemoveConstant()}>
                            <CancelIcon style={{fontSize:'1rem', color:"#f04461", borderRadius:5}}></CancelIcon>
                        </IconButton>
                    </Grid>
                    </>
                    }
                </Grid>
                }
            
                <Grid item container xs={12} sm={12} md={12} lg={12} align="left">
                    <Grid item xs={3} sm={3} md={3} lg={3}>
                        <Typography className={classes.blueText}>TAG : </Typography>
                    </Grid>
                    <Grid item xs={9} sm={9} md={9} lg={9}>
                        {/* <Tooltip title={specialTag ? specialTag : "-"} placement="top"> */}
                            <TextFieldItem id={`specialTag`} type="text" value={newSensor.tag} onChange={(value) => setNewSensor({...newSensor, tag: value})} defaultValue={false}></TextFieldItem>
                        {/* </Tooltip> */}
                    </Grid>
                </Grid>

                <Grid item container xs={12} sm={12} md={12} lg={12} align="left">
                    <Grid item xs={3} sm={3} md={3} lg={3}>
                        <Typography className={classes.blueText}>NAME : </Typography>
                    </Grid>
                    <Grid item xs={9} sm={9} md={9} lg={9}>
                        {/* <Tooltip title={specialTag ? specialTag : "-"} placement="top"> */}
                            <TextFieldItem id={`specialName`} type="text"  value={newSensor.name} onChange={(value) => setNewSensor({...newSensor, name: value})}></TextFieldItem>
                        {/* </Tooltip> */}
                    </Grid>
                </Grid>
                
                <Grid item xs={12} sm={12} md={12} lg={12} align="right">
                    <Button onClick={()=>onGenerateSensor()} className={classes.confirmButton}>
                        {/* <AddCircleOutlineIcon className={classes.whiteIcon}></AddCircleOutlineIcon> */}
                        <Typography className={classes.contentTextWhite}>Add Special Sensor</Typography>
                    </Button>
                </Grid>
                {/* </>
                }  */}
            </Grid>
            </DialogContent>
            <DialogActions className={classes.dialog}>
                <Button className={classes.defaultButton} onClick={handleClose}>
                    <Typography className={classes.contentTextBlack}>Close</Typography>
                </Button>
            </DialogActions>
            <DialogMessage  message={message} open={showMessage} handleCloseDialog={handleCloseDialog} ></DialogMessage>
        </Dialog>
        </>
    )

}