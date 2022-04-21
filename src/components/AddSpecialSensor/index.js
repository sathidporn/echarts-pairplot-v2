import React from 'react';
import Grid from '@mui/material/Grid'
import { useCallback, useState }  from 'react';
import { Table, TableContainer, TableHead, TableBody, TableRow, TableCell, Typography, Button, Select, MenuItem, IconButton, Tooltip, TextField } from '@mui/material';
import ArrowDropDownCircleIcon from '@mui/icons-material/ArrowDropDownCircle';
import CancelIcon from '@mui/icons-material/Cancel'
import { style } from '../../styles/style';
import SensorCustomize from '../SensorCustomize';

import { generateSensorTag, maximumSensorSelection } from '../../utils/calculate_sensor';
import TextFieldItem from '../TextFieldItem';
import SelectorItem from '../SelectorItem';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';

const useStyles = style

const calculationList = [{value:"select", name: "Select calculation"}, {value:"ADD", name: "Add"}, {value:"ABSDIFF", name: "Absolute Diff"}, {value:"MUL", name: "Multiply"}, {value:"DIV", name: "Divide"}, {value:"AVG", name: "Average"}]     

export default function AddSpecialSensor({ sensorsObj, specialSensors, onAddSpecialSensor=()=>{}, onUpdateSpecialSensors=()=>{},  onRemoveSpecialSensor = () => {}}){
    const classes = useStyles()
    
    let [derivedSensors, setDerivedSensors] = useState([])
    let [selected, setSelected] = useState([])
    let [calType, setCalType] = useState("select")
    let [constantState, setConstantState] = useState(false)
    let [constant, setConstant] = useState()
    let [specialTag, setSpecialTag] = useState("")
    let [specialName, setSpecialName] = useState("")
    let [maxSensors, setMaxSensors] = useState(maximumSensorSelection({calType, constant: false}))

    const handleChangeCalType = useCallback((type) => {
        if(type !== calType){
            setCalType(type)
            setDerivedSensors([])
            setConstant(undefined)
            setConstantState(false)
            let name = generateSensorTag({derivedSensors, calType: type})
            setSpecialTag(name)
            setMaxSensors(maximumSensorSelection({calType: type, constant: false}))
        }
    }, [derivedSensors, calType, setCalType, setSpecialTag, setMaxSensors, setConstantState])

    const onAddConstant = useCallback(() => {
        setConstant(undefined)
        setConstantState(true)
        setMaxSensors(maximumSensorSelection({calType, constant: true}))
    },[calType, setConstant, setConstantState, setMaxSensors])

    const onRemoveConstant = useCallback(() => {
        setConstant(undefined)
        setConstantState(false)
        setMaxSensors(maximumSensorSelection({calType, constant: false}))
    },[calType, setConstant, setConstantState, setMaxSensors])

    const onAddSensor = useCallback((curSensor) => {
        // let maxSensors = ({calType, constant: constantState})
        let index = derivedSensors.findIndex(sensor => sensor.tag === curSensor.tag)
        if(derivedSensors.length < maxSensors && index === -1){
            let newSensorList = [ ...derivedSensors, curSensor]
            setDerivedSensors(newSensorList)
            setSelected([...selected, curSensor.tag])
            let name = generateSensorTag({derivedSensors: newSensorList, calType})
            setSpecialTag(name)
        }
    },[derivedSensors, maxSensors, calType, selected, setDerivedSensors, setSpecialTag, setSelected])

    const onRemoveSensor = useCallback((curSensor) => {
        let newSensorList = derivedSensors.filter(sensor=>sensor.tag !== curSensor.tag)
        setDerivedSensors(newSensorList)
        let name = generateSensorTag({derivedSensors: newSensorList, calType})
        setSpecialTag(name)
    },[calType, derivedSensors, setDerivedSensors, setSpecialTag])

    const onGenerateSensor = useCallback(() => {
        // let objNewSensor = {tag: specialTag, name: "", derived: derivedSensors, calType: calType, subType: subType, fromUnit: "", toUnit: "", factor: ""}
        if(derivedSensors && specialTag && calType){
            let objNewSensor = {sensor: derivedSensors, tag: specialTag, name: specialName, calType: calType, constant: constant}
            onAddSpecialSensor(objNewSensor)
            setDerivedSensors([])
            setSpecialName("")
            setSpecialTag("")
            setCalType("select")
            setConstantState(false)

            let updateSpecialSensors = specialSensors
            for(let i=0; i<derivedSensors.length; i++){
                let objNew = {status: "new", specialTag: specialTag, specialName: specialName, derivedFromTag: derivedSensors[i].tag, derivedFromName: derivedSensors[i].name, calType: calType, subType: "", fromUnit: "", toUnit: "", factor: constant}
                updateSpecialSensors.push(objNew)
            }
            onUpdateSpecialSensors(updateSpecialSensors)
        }else{
            onAddSpecialSensor(undefined)
        }
    },[derivedSensors, calType, constant, specialTag, specialName, specialSensors, onUpdateSpecialSensors, onAddSpecialSensor])

    const onCustomizeSensors = useCallback((updateSpecialSensors) => {
        onUpdateSpecialSensors(updateSpecialSensors)
    },[onUpdateSpecialSensors])

    return(
        <>
        <Grid item container xs={12} sm={12} md={12} lg={12} spacing={1}>
            <Grid item container xs={12} sm={12} md={12} lg={12} spacing={1}>
                <Grid item xs={3} sm={3} md={3} lg={3}>
                    <Typography className={classes.blueText}>CALCULATION : </Typography>
                </Grid>
                <Grid item xs={9} sm={9} md={9} lg={9}>
                    <SelectorItem id={'calType'} value={calType} items={calculationList} onChange={(value) => handleChangeCalType(value)}></SelectorItem>
                </Grid>
            </Grid>

            {/* {derivedSensors.length > 0 &&
            <> */}

            <Grid item xs={12} sm={12} md={12} lg={12}>
                <TableContainer className={classes.tableContainer} >
                    <Table size="small" stickyHeader aria-label="sticky table">
                        <TableHead>
                        <TableRow>
                            <TableCell align="left" className={classes.tableCell}></TableCell>
                            <TableCell className={classes.tableCell}>SENSOR_TAG</TableCell>
                        </TableRow>
                        </TableHead>
                        <TableBody>
                        {sensorsObj.filter(sensor=> selected.indexOf(sensor.tag) === -1).map((sensor) => {
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
                <SensorCustomize sensors={specialSensors} specialSensor={true} onCustomizeSensors={onCustomizeSensors} onRemoveSpecialSensor={onRemoveSpecialSensor}></SensorCustomize>
            </Grid>

            <Grid item container xs={12} sm={12} md={12} lg={12} align="left">
                <Grid item xs={3} sm={3} md={3} lg={3}>
                    <Typography className={classes.blueText}>SENSOR : </Typography>
                </Grid>
                <Grid item xs={9} sm={9} md={9} lg={9} className={classes.sensorBox}>
                {derivedSensors.map((sensor) => {
                    return(
                    <Grid key={sensor.tag} item container xs={10} sm={10} md={10} lg={10} spacing={1} style={{paddingLeft: 10}}>
                        <Grid item xs={12} sm={12} md={12} lg={12}>
                            <Tooltip title={sensor?.tag} placement="top">
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

            <Grid item container xs={12} sm={12} md={12} lg={12} align="left" >
                {constantState === false &&
                <>
                <Grid item xs={3} sm={3} md={3} lg={3}>
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
                <Grid item xs={6} sm={6} md={6} lg={6}>
                    <TextFieldItem id={`constant`} type="number" value={constant} onChange={(value) => setConstant(value)} defaultValue={false}></TextFieldItem>
                </Grid>
                <Grid item xs={3} sm={3} md={3} lg={3}>
                    <IconButton onClick={()=>onRemoveConstant()}>
                        <CancelIcon style={{fontSize:'1rem', color:"#f04461", borderRadius:5}}></CancelIcon>
                    </IconButton>
                </Grid>
                </>
                }
            </Grid>
           
            <Grid item container xs={12} sm={12} md={12} lg={12} align="left">
                <Grid item xs={3} sm={3} md={3} lg={3}>
                    <Typography className={classes.blueText}>TAG : </Typography>
                </Grid>
                <Grid item xs={9} sm={9} md={9} lg={9}>
                    <Tooltip title={specialTag} placement="top">
                        <TextFieldItem id={`specialTag`} type="text" value={specialTag} onChange={(value) => setSpecialTag(value)} defaultValue={false}></TextFieldItem>
                    </Tooltip>
                </Grid>
            </Grid>

            <Grid item container xs={12} sm={12} md={12} lg={12} align="left">
                <Grid item xs={3} sm={3} md={3} lg={3}>
                    <Typography className={classes.blueText}>NAME : </Typography>
                </Grid>
                <Grid item xs={9} sm={9} md={9} lg={9}>
                    <Tooltip title={specialTag} placement="top">
                        <TextFieldItem id={`specialName`} type="text"  value={specialName} onChange={(value) => setSpecialName(value)}></TextFieldItem>
                    </Tooltip>
                </Grid>
            </Grid>
            
            <Grid item xs={12} sm={12} md={12} lg={12} align="right">
                <Button onClick={()=>onGenerateSensor()} className={classes.confirmButton}>
                    <AddCircleOutlineIcon className={classes.whiteIcon}></AddCircleOutlineIcon>
                    <Typography className={classes.contentTextWhite}>Add Special Sensor</Typography>
                </Button>
            </Grid>
            {/* </>
            }  */}
        </Grid>
        </>
    )

}