import React from 'react'
import { useState } from 'react'
import { format, subMonths } from 'date-fns'
import { Grid, TextField } from '@material-ui/core'
import { style } from '../../styles/style'
const useStyles = style
const MAX_PERIOD = 24

export default function DatePicker({ startSeries, endSeries, onFilteredByDate=()=>{} }){
    const classes = useStyles();
    let [startDate, setStartDate] = useState(new Date(startSeries))
    let [endDate, setEndDate] = useState(new Date(endSeries))

    return(
        <Grid item container lg={12}>
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
            <Grid item lg={6}>
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
                        onFilteredByDate(startDate, endDate)
                        // setStartDate(new Date(e.target.value))
                        // onFilteredByDate(new Date(e.target.value), endDate)
                    }}
                />
            </form> 
            </Grid>
            <Grid item lg={6}>
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
                        onFilteredByDate(startDate, endDate)
                    }}
                />
            </form> 
            </Grid>
        </Grid>
    )
}