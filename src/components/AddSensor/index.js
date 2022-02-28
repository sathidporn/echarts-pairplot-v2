import React from 'react';
import Grid from '@mui/material/Grid'
import { useCallback, useState }  from 'react';
import { Table, TableContainer, TableHead, TableBody, TableRow, TableCell, Typography, Button, Select, MenuItem, IconButton, Tooltip, TextField } from '@mui/material';
import ArrowDropDownCircleIcon from '@mui/icons-material/ArrowDropDownCircle';
import CancelIcon from '@mui/icons-material/Cancel'
import EditIcon from '@mui/icons-material/Edit';
import CheckIcon from '@mui/icons-material/Check';
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
        if(type !== calType){
            setCalType(type)
            setSensorList([])
            setConstant(undefined)
            let name = generateSensorName({sensorList, calType: type})
            setSpecialSensorName(name)
        }
    }, [sensorList, calType, setCalType, setSpecialSensorName])

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
        // console.log("special sensor",maxSensors)
        let objNewSensor = {sensor:sensorList, name: specialSensorName, calType: calType, processType: processType, constant: constant}
        onFeatureSensor(objNewSensor)
        setSensorList([])
    },[sensorList, calType, processType, constant, specialSensorName, onFeatureSensor])

    return(
        <>
        <Grid item container xs={12} sm={12} md={12} lg={12} spacing={1}>
            <Grid item container xs={12} sm={12} md={12} lg={12} spacing={1}>
                <Grid item xs={6} sm={6} md={6} lg={6}>
                    <Select
                        value={calType}
                        IconComponent = {ArrowDropDownCircleIcon}
                        // value={diffType}
                        // defaultValue={calType}
                        autoFocus={true}
                        inputProps={{
                            classes: {
                                icon: classes.selector,
                                root: classes.selector,
                            },
                        }}   
                        className={classes.selector}  
                        MenuProps={{
                            classes:{
                                list: classes.menuItem
                            }
                        }}  
                        onChange={(e)=>handleChangeCalType(e.target.value)}   
                    >
                        <MenuItem value="add" className={classes.menuItem}>Add</MenuItem>
                        <MenuItem value="diff" className={classes.menuItem}>Diff</MenuItem>
                        <MenuItem value="multiply" className={classes.menuItem}>Multiply</MenuItem>
                        <MenuItem value="divide" className={classes.menuItem}>Divide</MenuItem>
                        <MenuItem value="average" className={classes.menuItem}>Average</MenuItem>
                    </Select>
                </Grid>
                <Grid item xs={6} sm={6} md={6} lg={6}>
                    {/* <TextField id="outlined-basic" label="Outlined" variant="outlined"  className={classes.textField}  ></TextField> */}
                    <Select
                        value={processType}
                        IconComponent = {ArrowDropDownCircleIcon}
                        // value={diffType}
                        autoFocus={true}
                        inputProps={{
                            classes: {
                                icon: classes.selector,
                                root: classes.selector,
                            },
                        }}   
                        className={classes.selector}  
                        MenuProps={{
                            classes:{
                                list: classes.menuItem
                            }
                        }} 
                        onChange={(e)=>handleChangeProcessType(e.target.value)}    
                    >
                        <MenuItem value="sensor" className={classes.menuItem}>By sensor</MenuItem>
                        <MenuItem value="constant" className={classes.menuItem}>By constant</MenuItem>
                    </Select>
                </Grid>

            </Grid>


            {sensorList.length > 0 &&
            <>
            <Grid item xs={12} sm={12} md={12} lg={12} align="left">
                {processType === "constant" &&
                    <Grid item container lg={12} align="left" >
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
            </Grid>
            <Grid item container xs={12} sm={12} md={12} lg={12} align="left">
                <Grid item xs={2} sm={2} md={2} lg={2}>
                    <Typography className={classes.blueText}>SENSOR : </Typography>
                </Grid>
                <Grid item xs={10} sm={10} md={10} lg={10} className={classes.sensorBox}>
                {sensorList.map((sensor) => {
                    return(
                    <Grid key={sensor} item container xs={10} sm={10} md={10} lg={10} spacing={1} style={{paddingLeft: 10}}>
                        <Grid item xs={12} sm={12} md={12} lg={12}>
                            <Tooltip title={sensor} placement="top">
                                <Typography className={classes.blueText}>
                                    {sensor.length > 40 ? `${sensor.substring(0,40)}...` : `${sensor}`}
                                    {/* <Tooltip title="Remove" placement="right"> */}
                                    <IconButton onClick={()=>onRemoveSensor(sensor)} >
                                        <CancelIcon style={{fontSize:'1rem', color:"#f04461", borderRadius:5}}></CancelIcon>
                                    </IconButton>
                                    {/* </Tooltip> */}
                                </Typography>
                            </Tooltip>
                            </Grid>
                    </Grid>  
                    )
                })}
                </Grid>
            </Grid>
            <Grid item xs={12} sm={12} md={12} lg={12} align="left">
                <Grid item container xs={12} sm={12} md={12} lg={12} align="left">
                    <Grid item xs={2} sm={2} md={2} lg={2}>
                        <Typography className={classes.blueText}>NAME : </Typography>
                    </Grid>
                    <Grid item xs={10} sm={10} md={10} lg={10}>
                        <form autoComplete="off" onSubmit={e => {e.preventDefault()}}>
                            <Tooltip title={specialSensorName} placement="top">
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
                                    // disabled={!editName}
                                />
                            </Tooltip>
                        </form>
                    </Grid>
                    {/* <Grid item xs={1} sm={1} md={1} lg={1}>
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
                    </Grid> */}
                </Grid>
            </Grid>
            <Grid item xs={12} sm={12} md={12} lg={12}>
                <Button onClick={()=>onGenerateSensor()} className={classes.button}>Generate Sensor</Button>
            </Grid>
            </>
            } 
 
            <Grid item xs={12} sm={12} md={12} lg={12}>
                <TableContainer className={classes.tableContainer} >
                    <Table size="small" stickyHeader aria-label="sticky table">
                        <TableHead>
                        <TableRow>
                            <TableCell align="left" className={classes.tableCell}>Add</TableCell>
                            <TableCell className={classes.tableCell}>Sensor</TableCell>
                        </TableRow>
                        </TableHead>
                        <TableBody>
                        {sensorsObj.filter(sensor=> !sensorList.includes(sensor.tag)).map((sensor) => {
                            return(
                            <TableRow
                                key={sensor.tag}
                                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                            >
                                <TableCell align="left"  className={classes.tableCell}>
                                    <Button onClick={()=>onAddSensor(sensor.tag)} className={classes.button}>Add</Button>
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
        </Grid>
        </>
    )

}