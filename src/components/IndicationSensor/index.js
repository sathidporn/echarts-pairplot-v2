import React, { useCallback, useState } from 'react';
import Grid from '@mui/material/Grid'
import { Select, Typography, MenuItem, TextField, Button, Box } from '@mui/material';
import ArrowDropDownCircleIcon from '@mui/icons-material/ArrowDropDownCircle';
import TextFieldItem from '../TextFieldItem';
import SelectorItem from '../SelectorItem';
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import BrushIcon from '@mui/icons-material/Brush';
import { style } from '../../styles/style'
const useStyles = style

let operatorList = [
    {value: "select", name: "Select Operator"}, 
    {value: "inRange", name: "In Range"},
    {value: "equal", name: "Equal"},
    {value: "moreThan", name: "More than"},
    {value: "moreThanEqual", name: "More than equal"},
    {value: "lessThan", name: "Less than"},
    {value: "lessThanEqual", name: "Less than equal"},
]

export default function IndicationSensor({ sensors, filteredTimestamps, series, onBrushActivate = () => {}, onIndicationSensor = () => {}, onFilterByIndicator = () => {}, onClearBrushSelected = () => {}, indexCluster=false}){
    let classes = useStyles();
    let [operator, setOperator] = useState("select")
    let [sensor, setSensor] = useState("select")
    let [value1, setValue1] = useState()
    let [value2, setValue2] = useState()

    const onAddIndicationSensor = useCallback(() => {
        if(indexCluster) {
            let valuesArr = []
            for (let i = 0; i < filteredTimestamps.length; i++) {
                if(operator === "inRange"){
                    if (series[sensor][i] >= value1 && series[sensor][i] <= value2) {
                        valuesArr = [...valuesArr, i]
                    }
                }else if (operator === "equal"){
                    if (series[sensor][i] === value1) {
                        valuesArr = [...valuesArr, i]
                    }
                }else if(operator === "moreThan"){
                    if (series[sensor][i] > value1) {
                        valuesArr = [...valuesArr, i]
                    }
                }else if(operator === "moreThanEqual"){
                    if (series[sensor][i] >= value1){
                        valuesArr = [...valuesArr, i]
                    }
                }else if(operator === "lessThan"){
                    if (series[sensor][i] < value1) {
                        valuesArr = [...valuesArr, i]
                    }
                }else if(operator === "lessThanEqual"){
                    if (series[sensor][i] <= value1){
                        valuesArr = [...valuesArr, i]
                    }
                }
            }
            // setDataClusterIndex(clusterIndexArr)
            onIndicationSensor(valuesArr)
            onBrushActivate()

        }else{
            onFilterByIndicator(sensor, operator, value1, value2)
        }

    },[sensor, operator, value1, value2, series, filteredTimestamps, indexCluster, onBrushActivate, onIndicationSensor, onFilterByIndicator])

    return(
        <Grid item container xs={12} sm={12} md={12} lg={12} spacing={1}>
            <Grid item xs={12} sm={12} md={12} lg={12}>
                <Grid item container xs={12} sm={12} md={12} lg={12} spacing={1}>
                    <Grid item xs={3} sm={3} md={3} lg={3} align="left">
                        <Typography className={classes.blueText}>SENSOR : </Typography>
                    </Grid>
                    <Grid item xs={9} sm={9} md={9} lg={9}>
                    {/* <TextField id="outlined-basic" label="Outlined" variant="outlined"  className={classes.textField}  ></TextField> */}
                        <Select
                            value={sensor}
                            IconComponent = {ArrowDropDownCircleIcon}
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
                            onChange={(e)=>setSensor(e.target.value)}    
                        >
                            <MenuItem value={"select"} className={classes.menuItem}>Select sensor</MenuItem>
                            {sensors.map((sensor) => {
                                return (
                                <MenuItem key={sensor.tag !== undefined ? sensor.tag : sensor} value={sensor.tag !== undefined ? sensor.tag : sensor} className={classes.menuItem}>{sensor.tag !== undefined ? sensor.tag : sensor} </MenuItem>
                                )
                            })}
                        </Select>
                    </Grid>
                </Grid>
            </Grid>
            <Grid item xs={12} sm={12} md={12} lg={12}>
                <Grid item container xs={12} sm={12} md={12} lg={12} spacing={1}>
                    <Grid item xs={3} sm={3} md={3} lg={3} align="left">
                        <Typography className={classes.blueText}>OPERATOR : </Typography>
                    </Grid>
                    <Grid item xs={9} sm={9} md={9} lg={9}>
                        <SelectorItem id={'operator'} value={operator} items={operatorList} onChange={(value) => setOperator(value)}></SelectorItem>
                    </Grid>
                    <Grid item container xs={12} sm={12} md={12} lg={12}>
                        <Grid item xs={2} sm={2} md={2} lg={2} align="left">
                            <Typography className={classes.blueText}>
                                VALUE
                            </Typography>
                        </Grid>
                        <Grid item xs={1} sm={1} md={1} lg={1} align="center">
                            <Typography className={classes.blueText}>
                                {operator === "equal" ? "=" : operator === "moreThan" ? ">" : operator === "moreThanEqual" ? ">=" : operator === "lessThan" ? "<" : operator === "lessThanEqual" ? "<=" : ""}
                            </Typography>
                        </Grid>
                        <Grid item xs={operator !== "inRange" ? 9 : 4} sm={operator !== "inRange" ? 9 : 4} md={operator !== "inRange" ? 9 : 4} lg={operator !== "inRange" ? 9 : 4}>
                            <TextFieldItem id={`value1`} type="number" value={value1} onChange={(value) => setValue1(value)}></TextFieldItem>
                        </Grid>
                        {operator === "inRange" &&
                        <>
                        <Grid item xs={1} sm={1} md={1} lg={1}>
                            <Typography className={classes.blueText}>-</Typography>
                        </Grid>
                        <Grid item xs={4} sm={4} md={4} lg={4}>
                            <TextFieldItem id={`value2`} type="number" value={value2} onChange={(value) => setValue2(value)}></TextFieldItem>
                        </Grid>
                        </>
                        }
                    </Grid>
                </Grid>
            </Grid>

            {/* <Grid item xs={12} sm={12} md={12} lg={6} align="right"> */}
                <Grid item container xs={12} sm={12} md={12} lg={12} style={{justifyContent: "flex-end"}}>
                    {indexCluster &&
                    <Grid item xs={12} sm={12} md={12} lg={6}>
                        <Button onClick={onClearBrushSelected} className={classes.confirmButton}>
                            <Typography className={classes.contentTextWhite}>Reset All</Typography>
                        </Button>
                    </Grid>
                    } 
                    <Grid item xs={12} sm={12} md={12} lg={6}>
                        <Button onClick={onAddIndicationSensor} className={classes.confirmButton}>
                            {indexCluster ? 
                            (<BrushIcon className={classes.whiteIcon}></BrushIcon>):(<FilterAltIcon className={classes.whiteIcon}></FilterAltIcon>)
                            }
                            <Typography className={classes.contentTextWhite}>{indexCluster ? `Brush` : `Filter Data`}</Typography>
                        </Button>
                    </Grid>
                </Grid>
            {/* </Grid> */}

        </Grid> 
        

    )

}