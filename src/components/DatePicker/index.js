import React from 'react'
import { useState } from 'react'
import { format, subMonths } from 'date-fns'
import { Grid, TextField, Button, Typography } from '@mui/material'
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import { style } from '../../styles/style'
const useStyles = style
const MAX_PERIOD = 24

export default function DatePicker({ startSeries, endSeries, onPickedDate=()=>{} }){
    const classes = useStyles();
    let [startDate, setStartDate] = useState(new Date(startSeries))
    let [endDate, setEndDate] = useState(new Date(endSeries))

    return(
        <Grid item container xs={12} sm={12} md={12} lg={12} spacing={1}>
            {/* <input
                type="date"
                name="start date"
                min={format(subMonths(startSeries, MAX_PERIOD), "yyyy-MM-dd")}
                max={format(endSeries, "yyyy-MM-dd")}
                value={format(startDate, "yyyy-MM-dd")}
                onChange={(e) => {
                    let startDate = new Date(e.target.value)
                    startDate.setHours(0)
                    startDate.setMinutes(0)
                    startDate.setSeconds(0)
                    startDate.setMilliseconds(0)
                    setStartDate(startDate)
                    onFilteredByDate(startDate, endDate)
                    // setStartDate(new Date(e.target.value))
                    // onFilteredByDate(new Date(e.target.value), endDate)
                }}
            /> */}
            <Grid item xs={4} sm={4} md={4} lg={4}>
            <form className={classes.container} noValidate>
                <TextField
                    label="Start Date"
                    type="date"
                    name="start date"
                    variant="outlined"
                    min={format(subMonths(startSeries, MAX_PERIOD), "yyyy-MM-dd")}
                    max={format(endSeries, "yyyy-MM-dd")}
                    value={format(startDate, "yyyy-MM-dd")}
                    className={classes.datePicker}
                    InputLabelProps={{
                        shrink: true,
                        className: classes.datePicker
                    }}
                    inputProps={{
                        min: format(subMonths(endDate, MAX_PERIOD), "yyyy-MM-dd"),
                        max: format(endDate, "yyyy-MM-dd")
                    }}
                    onChange={(e) => {
                        let startDate = new Date(e.target.value)
                        startDate.setHours(0)
                        startDate.setMinutes(0)
                        startDate.setSeconds(0)
                        startDate.setMilliseconds(0)
                        setStartDate(startDate)
                        // onPickedDate(startDate, endDate)
                        // setStartDate(new Date(e.target.value))
                        // onFilteredByDate(new Date(e.target.value), endDate)
                    }}
                />
            </form> 
            </Grid>
            <Grid item xs={4} sm={4} md={4} lg={4}>
            <form className={classes.container} noValidate>
                <TextField
                    label="End Date"
                    type="date"
                    name="end date"
                    variant="outlined"
                    min={format(subMonths(startSeries, MAX_PERIOD), "yyyy-MM-dd")}
                    max={format(endSeries, "yyyy-MM-dd")}
                    value={format(endDate, "yyyy-MM-dd")}
                    className={classes.datePicker}
                    InputLabelProps={{
                        shrink: true,
                        className: classes.datePicker
                    }}
                    inputProps={{
                        min: format(subMonths(endDate, MAX_PERIOD), "yyyy-MM-dd"),
                        max: format(endDate, "yyyy-MM-dd")
                    }}
                    onChange={(e) => {
                        let endDate = new Date(e.target.value)
                        endDate.setHours(23)
                        endDate.setMinutes(59)
                        endDate.setSeconds(59)
                        endDate.setMilliseconds(999)
                        setEndDate(endDate)
                        // onPickedDate(startDate, endDate)
                    }}
                />
            </form> 
            </Grid>
            <Grid item xs={4} sm={4} md={4} lg={4} align="right">
                <Button onClick={()=>onPickedDate(startDate, endDate)} className={classes.confirmButton}>
                    <FilterAltIcon className={classes.whiteIcon}></FilterAltIcon>
                    <Typography className={classes.contentTextWhite}>Filter Data</Typography>
                </Button>
            </Grid>
        </Grid>
    )
}