import React, { useCallback, useState } from 'react';
import Grid from '@mui/material/Grid'
import { Select, Typography, MenuItem, TextField, Button } from '@mui/material';
import ArrowDropDownCircleIcon from '@mui/icons-material/ArrowDropDownCircle';
import { style } from '../../styles/style'
const useStyles = style

export default function ClusterRange({ checkedSensors, timestampsAxis, series, onBrushActivate = () => {}, onTestClusterRange = () => {}}){
    let classes = useStyles();
    let [operator, setOperator] = useState("inRange")
    let [sensor, setSensor] = useState(checkedSensors[0])
    let [value1, setValue1] = useState()
    let [value2, setValue2] = useState()
    console.log("sensor",checkedSensors)


    const onAddClusterRange = useCallback(() => {
        let valuesArr = []
        for (let i = 0; i < timestampsAxis.length; i++) {
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
        onTestClusterRange(valuesArr)
        onBrushActivate()
    },[sensor, operator, value1, value2, series, timestampsAxis, onBrushActivate, onTestClusterRange])
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
                            {checkedSensors.map((sensor) => {
                                return (
                                <MenuItem value={sensor} className={classes.menuItem}>{sensor}</MenuItem>
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
                        <Select
                            value={operator}
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
                            onChange={(e)=>setOperator(e.target.value)}    
                        >
                            <MenuItem key="inRange" value="inRange" className={classes.menuItem}>In Range</MenuItem>
                            <MenuItem key="equal" value="equal" className={classes.menuItem}>Equal</MenuItem>
                            <MenuItem key="moreThan" value="moreThan" className={classes.menuItem}>More than</MenuItem>
                            <MenuItem key="moreThanEqual" value="moreThanEqual" className={classes.menuItem}>More than equal</MenuItem>
                            <MenuItem key="lessThan" value="lessThan" className={classes.menuItem}>Less than</MenuItem>
                            <MenuItem key="lessThanEqual" value="lessThanEqual" className={classes.menuItem}>Less than equal</MenuItem>
                        </Select>
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
                                    error={value1 === undefined}
                                    onChange={({target}) => setValue1(target.value)}
                                    // value={enteredCode}
                                    tabIndex={0}
                                />
                            </form>
                        </Grid>
                        {operator === "inRange" &&
                        <>
                        <Grid item xs={1} sm={1} md={1} lg={1}>
                            <Typography className={classes.blueText}>-</Typography>
                        </Grid>
                        <Grid item xs={4} sm={4} md={4} lg={4}>
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
                                    error={value1 === undefined}
                                    onChange={({target}) => setValue2(target.value)}
                                    // value={enteredCode}
                                    tabIndex={0}
                                />
                            </form>
                        </Grid>
                        </>
                        }
                    </Grid>
                    <Grid item xs={12} sm={12} md={12} lg={12}>
                        <Button onClick={onAddClusterRange} className={classes.button}>Add condition</Button>
                    </Grid>
                </Grid>
            </Grid>

        </Grid> 
        

    )

}