import React from 'react';
import Grid from '@material-ui/core/Grid'
import { useCallback, useState }  from 'react';
import { Table, TableContainer, TableHead, TableBody, TableRow, TableCell, Typography, Button, Select, MenuItem, IconButton, Tooltip, TextField } from '@material-ui/core';
import ArrowDropDownCircleIcon from '@material-ui/icons/ArrowDropDownCircle';
import CancelIcon from '@material-ui/icons/Cancel'
import EditIcon from '@material-ui/icons/Edit';
import CheckIcon from '@material-ui/icons/Check';
import { style } from '../../styles/style';

import { generateSensorName, maximumSensorSelection } from '../../utils/calculate_sensor';

const useStyles = style

export default function AddSensor({ sensorsObj, onFeatureSensor=()=>{}}){
    const classes = useStyles()
    
    let [editName, setEditName] = useState(false)
    let [specialSensorName, setSpecialSensorName] = useState("")
    let [sensorList, setSensorList] = useState([])
    let [calType, setCalType] = useState("add")
    let [processType, setProcessType] = useState("sensor")
    let [constant, setConstant] = useState()

    const handleChangeCalType = useCallback((type) => {
        setCalType(type)
        let name = generateSensorName({sensorList, calType: type})
        setSpecialSensorName(name)
    }, [sensorList, setCalType, setSpecialSensorName])

    const handleChangeProcessType = useCallback((type) => {
        if(type !== processType){
            setProcessType(type)
            setSensorList([])
            setConstant(undefined)
            setSpecialSensorName("")
        }
    }, [processType, setProcessType, setSensorList, setConstant, setSpecialSensorName])

    const editSensorName = useCallback(() => {
        setEditName(!editName)
    },[editName, setEditName])

    const onAddSensor = useCallback((curSensor) => {
        let maxSensors = maximumSensorSelection({calType, processType})
        let index = sensorList.findIndex(sensor => sensor === curSensor)
        if(sensorList.length < maxSensors && index === -1){
            let newSensorList = [ ...sensorList, curSensor]
            setSensorList(newSensorList)
            let name = generateSensorName({sensorList: newSensorList, calType})
            setSpecialSensorName(name)
        }
    },[sensorList, calType, processType, setSensorList, setSpecialSensorName])

    const onRemoveSensor = useCallback((curSensor) => {
        let newSensorList = sensorList.filter(sensor=>sensor!==curSensor)
        setSensorList(newSensorList)
        let name = generateSensorName({sensorList: newSensorList, calType})
        setSpecialSensorName(name)
    },[calType, sensorList, setSensorList, setSpecialSensorName])

    const onGenerateSensor = useCallback(() => {
        let maxSensors = maximumSensorSelection({calType, processType})
        console.log("special sensor",maxSensors)
        let objNewSensor = {sensor:sensorList, name: specialSensorName, calType: calType, processType: processType, constant: constant}
        onFeatureSensor(objNewSensor)
        setSensorList([])
    },[sensorList, calType, processType, constant, specialSensorName, onFeatureSensor])

    return(
        <>
        <Grid item container lg={12} spacing={1}>
            <Grid item container lg={12} spacing={1}>
                <Grid item lg={6}>
                    <Select
                        IconComponent = {ArrowDropDownCircleIcon}
                        onChange={(e)=>handleChangeCalType(e.target.value)}
                        // value={diffType}
                        defaultValue={calType}
                        autoFocus={true}
                        inputProps={{
                            classes: {
                                icon: classes.selectorIcon,
                                root: classes.selector,
                            },
                        }}   
                        className={classes.selector}  
                        MenuProps={{
                            classes:{
                            list: classes.menuItem
                            }
                        }}     
                    >
                        <MenuItem value="add" className={classes.menuItem}>Add</MenuItem>
                        <MenuItem value="diff" className={classes.menuItem}>Diff</MenuItem>
                        <MenuItem value="multiply" className={classes.menuItem}>Multiply</MenuItem>
                        <MenuItem value="divide" className={classes.menuItem}>Divide</MenuItem>
                        <MenuItem value="average" className={classes.menuItem}>Average</MenuItem>
                    </Select>
                </Grid>
                <Grid item lg={6}>
                    {/* <TextField id="outlined-basic" label="Outlined" variant="outlined"  className={classes.textField}  ></TextField> */}
                    <Select
                        IconComponent = {ArrowDropDownCircleIcon}
                        onChange={(e)=>handleChangeProcessType(e.target.value)}
                        // value={diffType}
                        defaultValue={processType}
                        autoFocus={true}
                        inputProps={{
                            classes: {
                                icon: classes.selectorIcon,
                                root: classes.selector,
                            },
                        }}   
                        className={classes.selector}  
                        MenuProps={{
                            classes:{
                            list: classes.menuItem
                            }
                        }}     
                    >
                        <MenuItem value="sensor" className={classes.menuItem}>By sensor</MenuItem>
                        <MenuItem value="constant" className={classes.menuItem}>By constant</MenuItem>
                    </Select>
                </Grid>

            </Grid>


            {sensorList.length > 0 &&
            <>
            <Grid item lg={12} className={classes.sensorBox} align="left">
                {processType === "constant" &&
                    <Grid item container lg={12} align="left" style={{paddingLeft: 10}}>
                        <Grid item lg={2}>
                            <Typography className={classes.blueText}>CONSTANT : </Typography>
                        </Grid>
                        <Grid item lg={5}>
                        <form autoComplete="off" onSubmit={e => {e.preventDefault()}}>
                            <TextField
                                fullWidth
                                className={classes.textField}
                                type="number"
                                rows={1}
                                InputProps={{
                                    className: classes.textField
                                }}
                                InputLabelProps={{
                                    shrink: true,
                                    className: classes.textField
                                }}
                                variant="outlined"
                                error={constant === undefined || constant === 0}
                                onChange={({target}) => setConstant(target.value)}
                                // value={enteredCode}
                                tabIndex={0}
                            />
                        </form>
                        </Grid>
                    </Grid>
                }
                {sensorList.map((sensor) => {
                    return(
                    <Grid key={sensor} item container lg={12} spacing={0} style={{paddingLeft: 10}}>
                        <Grid item lg={12}>
                        <Tooltip title={sensor} placement="bottom">
                            <Typography className={classes.blueText}>
                                {sensor.length > 40 ? `${sensor.substring(0,40)}...` : `${sensor}`}
                                <Tooltip title="Remove" placement="right">
                                <IconButton onClick={()=>onRemoveSensor(sensor)} >
                                    <CancelIcon style={{fontSize:'1rem', color:"#858e95", borderRadius:5}}></CancelIcon>
                                </IconButton>
                                </Tooltip>
                            </Typography>
                        </Tooltip>
                        </Grid>
                    </Grid>
                        
                    )
                })}
            </Grid>
            <Grid item lg={12} align="left">
                <Grid item container lg={12} align="left" style={{paddingLeft: 10}}>
                    <Grid item lg={2}>
                        <Typography className={classes.blueText}>NAME : </Typography>
                    </Grid>
                    <Grid item lg={9}>
                        <form autoComplete="off" onSubmit={e => {e.preventDefault()}}>
                            <Tooltip title={specialSensorName} placement="right">
                                <TextField
                                    fullWidth
                                    className={classes.textField}
                                    rows={1}
                                    // InputProps={{
                                    //     className: classes.textField
                                    // }}
                                    InputLabelProps={{
                                        shrink: true,
                                        className: classes.textField
                                    }}
                                    InputProps={{
                                        classes:{
                                          root: classes.textField,
                                          disabled: classes.textField
                                        }
                                      }}
                                    variant="outlined"
                                    error={specialSensorName === ""}
                                    onChange={({target}) => setSpecialSensorName(target.value)}
                                    value={specialSensorName}
                                    tabIndex={0}
                                    disabled={!editName}
                                />
                            </Tooltip>
                        </form>
                    </Grid>
                    <Grid item lg={1}>
                        <Tooltip title="Edit" placement="right">
                            <IconButton onClick={()=>editSensorName()} >
                                {editName === false &&
                                <EditIcon style={{fontSize:'1rem', color:"#858e95", borderRadius:5}}></EditIcon>
                                }
                                {editName === true && 
                                <CheckIcon style={{fontSize:'1rem', color:"#858e95", borderRadius:5}}></CheckIcon>
                                }
                            </IconButton>
                        </Tooltip>
                    </Grid>
                </Grid>
            </Grid>
            <Grid item lg={12}>
                <Button onClick={()=>onGenerateSensor()} className={classes.button}>Generate Sensor</Button>
            </Grid>
            </>
            } 
 
            <Grid item lg={12}>
                <TableContainer className={classes.tableContainer} >
                    <Table size="small" stickyHeader aria-label="sticky table">
                        <TableHead>
                        <TableRow>
                            <TableCell align="left" className={classes.tableHead}>Add</TableCell>
                            <TableCell className={classes.tableHead}>Sensor</TableCell>
                        </TableRow>
                        </TableHead>
                        <TableBody>
                        {sensorsObj.filter(sensor=> !sensorList.includes(sensor.tag)).map((sensor) => {
                            return(
                            <TableRow
                                key={sensor.tag}
                                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                            >
                                <TableCell align="right"  className={classes.tableCell}>
                                    <Button onClick={()=>onAddSensor(sensor.tag)} className={classes.button}>Add</Button>
                                </TableCell>
                                <TableCell component="th" scope="row" className={classes.tableCell}>
                                    <Typography  className={classes.formControlLabel}>{sensor.tag}</Typography>
                                </TableCell>
                            </TableRow>
                            )
                        })}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Grid>
        </Grid>
        </>
    )

}