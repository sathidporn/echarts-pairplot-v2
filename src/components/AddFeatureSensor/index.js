import React from 'react';
import Grid from '@mui/material/Grid'
import { useCallback, useState }  from 'react';
import { Table, TableContainer, TableHead, TableBody, TableRow, TableCell, Typography, Button, Select, MenuItem, IconButton, Tooltip, TextField } from '@mui/material';
import ArrowDropDownCircleIcon from '@mui/icons-material/ArrowDropDownCircle';
import CancelIcon from '@mui/icons-material/Cancel'
import { style } from '../../styles/style';
import ImportSensorList from '../ImportSensorList';
import SensorCustomize from '../SensorCustomize';

import { generateSensorTag, maximumSensorSelection } from '../../utils/calculate_sensor';

const useStyles = style

export default function AddFeatureSensor({ sensorsObj, onAddFeatureSensor=()=>{}}){
    const classes = useStyles()
    
    // let [editName, setEditName] = useState(false)
    let [specialTag, setSpecialTag] = useState("")
    let [specialName, setSpecialName] = useState("")
    let [derivedSensors, setDerivedSensors] = useState([])
    let [calType, setCalType] = useState("ADD")
    let [processType, setProcessType] = useState("sensor")
    let [constant, setConstant] = useState()

    const handleChangeCalType = useCallback((type) => {
        if(type !== calType){
            setCalType(type)
            setDerivedSensors([])
            setConstant(undefined)
            let name = generateSensorTag({derivedSensors, calType: type})
            setSpecialTag(name)
        }
    }, [derivedSensors, calType, setCalType, setSpecialTag])

    const handleChangeProcessType = useCallback((type) => {
        if(type !== processType){
            setProcessType(type)
            setDerivedSensors([])
            setConstant(undefined)
            setSpecialTag("")
        }
    }, [processType, setProcessType, setDerivedSensors, setConstant, setSpecialTag])

    let [specialSensorList, setSpecialSensorList] = useState([])
    let [specialSensors, setSpecialSensors] = useState([])

    const onReadSensorListFile = useCallback((list) => {
        setSpecialSensors(list.filter(sensor=>sensor.SPECIAL_TAG !== "").map(sensor => {
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
        }))
    },[setSpecialSensors])

    const onAddSensor = useCallback((curSensor) => {
        let maxSensors = maximumSensorSelection({calType, processType})
        let index = derivedSensors.findIndex(sensor => sensor.tag === curSensor.tag)
        if(derivedSensors.length < maxSensors && index === -1){
            let newSensorList = [ ...derivedSensors, curSensor]
            setDerivedSensors(newSensorList)
            let name = generateSensorTag({derivedSensors: newSensorList, calType})
            setSpecialTag(name)
        }
    },[derivedSensors, calType, processType, setDerivedSensors, setSpecialTag])

    const onRemoveSensor = useCallback((curSensor) => {
        let newSensorList = derivedSensors.filter(sensor=>sensor.tag !== curSensor.tag)
        setDerivedSensors(newSensorList)
        let name = generateSensorTag({derivedSensors: newSensorList, calType})
        setSpecialTag(name)
    },[calType, derivedSensors, setDerivedSensors, setSpecialTag])

    const onGenerateSensor = useCallback(() => {
        // let objNewSensor = {tag: specialTag, name: "", derived: derivedSensors, calType: calType, subType: subType, fromUnit: "", toUnit: "", factor: ""}
        let objNewSensor = {sensor: derivedSensors, tag: specialTag, name: specialName, calType: calType, processType: processType, constant: constant}
        onAddFeatureSensor(objNewSensor)
        setDerivedSensors([])
        setSpecialName("")

        let updateSpecialSensors = specialSensors
        for(let i=0; i<derivedSensors.length; i++){
            let objNew = {status: "new", specialTag: specialTag, specialName: specialName, derivedFromTag: derivedSensors[i].tag, derivedFromName: derivedSensors[i].name, calType: calType, subType: "", fromUnit: "", toUnit: "", factor: constant}
            updateSpecialSensors.push(objNew)
        }
        setSpecialSensors(updateSpecialSensors)
    },[derivedSensors, calType, processType, constant, specialTag, specialName, specialSensors, setSpecialSensors, onAddFeatureSensor])

    const onRemoveSpecialSensor= useCallback((tag) => {
        let updateSpecialSensors = specialSensors.filter(sensor=> sensor.specialTag !== tag)
        setSpecialSensors(updateSpecialSensors)
    }, [specialSensors, setSpecialSensors])

    const onCustomizeSensors = useCallback((updateSpecialSensors) => {
        setSpecialSensors(updateSpecialSensors)
    },[setSpecialSensors])

    return(
        <>
        <Grid item container xs={12} sm={12} md={12} lg={12} spacing={1}>
            <Grid item container xs={12} sm={12} md={12} lg={12} spacing={1}>
                <Grid item xs={12} sm={12} md={12} lg={12}>
                    <ImportSensorList onReadSensorListFile={onReadSensorListFile}></ImportSensorList>
                </Grid>
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
                        <MenuItem value="ADD" className={classes.menuItem}>Add</MenuItem>
                        <MenuItem value="ABSDIFF" className={classes.menuItem}>Diff</MenuItem>
                        <MenuItem value="MUL" className={classes.menuItem}>Multiply</MenuItem>
                        <MenuItem value="DIV" className={classes.menuItem}>Divide</MenuItem>
                        <MenuItem value="AVG" className={classes.menuItem}>Average</MenuItem>
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


            {derivedSensors.length > 0 &&
            <>
            <Grid item container xs={12} sm={12} md={12} lg={12} align="left">
                <Grid item xs={2} sm={2} md={2} lg={2}>
                    <Typography className={classes.blueText}>SENSOR : </Typography>
                </Grid>
                <Grid item xs={10} sm={10} md={10} lg={10} className={classes.sensorBox}>
                {derivedSensors.map((sensor) => {
                    return(
                    <Grid key={sensor.tag} item container xs={10} sm={10} md={10} lg={10} spacing={1} style={{paddingLeft: 10}}>
                        <Grid item xs={12} sm={12} md={12} lg={12}>
                            <Tooltip title={sensor.tag} placement="top">
                                <Typography className={classes.blueText}>
                                    {sensor.tag.length > 40 ? `${sensor.tag.substring(0,40)}...` : `${sensor.tag}`}
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
            <Grid item xs={12} sm={12} md={12} lg={12} align="left">
                <Grid item container xs={12} sm={12} md={12} lg={12} align="left">
                    <Grid item xs={2} sm={2} md={2} lg={2}>
                        <Typography className={classes.blueText}>TAG : </Typography>
                    </Grid>
                    <Grid item xs={10} sm={10} md={10} lg={10}>
                        <form autoComplete="off" onSubmit={e => {e.preventDefault()}}>
                            <Tooltip title={specialTag} placement="top">
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
                                    error={specialTag === ""}
                                    onChange={({target}) => setSpecialTag(target.value)}
                                    value={specialTag}
                                    tabIndex={0}
                                    // disabled={!editName}
                                />
                            </Tooltip>
                        </form>
                    </Grid>
                    <Grid item xs={2} sm={2} md={2} lg={2}>
                        <Typography className={classes.blueText}>NAME : </Typography>
                    </Grid>
                    <Grid item xs={10} sm={10} md={10} lg={10}>
                        <form autoComplete="off" onSubmit={e => {e.preventDefault()}}>
                            <Tooltip title={specialTag} placement="top">
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
                                    error={specialName === ""}
                                    onChange={({target}) => setSpecialName(target.value)}
                                    value={specialName}
                                    tabIndex={0}
                                    // disabled={!editName}
                                />
                            </Tooltip>
                        </form>
                    </Grid>
 
                </Grid>
            </Grid>
            <Grid item xs={12} sm={12} md={12} lg={12}>
                <Button onClick={()=>onGenerateSensor()} className={classes.confirmButton}>
                    <Typography className={classes.contentTextWhite}>Generate Sensor</Typography>
                </Button>
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
                        {sensorsObj.filter(sensor=> !derivedSensors.includes(sensor.tag)).map((sensor) => {
                            return(
                            <TableRow
                                key={sensor.tag}
                                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                            >
                                <TableCell align="left"  className={classes.tableCell}>
                                    <Button onClick={()=>onAddSensor({tag: sensor.tag, name: sensor.name})} className={classes.defaultButton}>
                                        <Typography className={classes.contentTextBlack}>Add</Typography>
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
                <SensorCustomize sensors={specialSensors} specialSensor={true} onCustomizeSensors={onCustomizeSensors} onRemoveSpecialSensor={onRemoveSpecialSensor}></SensorCustomize>
            </Grid>
        </Grid>
        </>
    )

}