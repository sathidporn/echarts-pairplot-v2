import React from 'react'
import { useState } from 'react'
import { format, subMonths } from 'date-fns'
const MAX_PERIOD = 24

export default function DatePicker({ startSeries, endSeries, onFilteredByDate=()=>{} }){
    let [startDate, setStartDate] = useState(new Date(startSeries))
    let [endDate, setEndDate] = useState(new Date(endSeries))

    return(
        <div>
            <input
                type="date"
                name="start date"
                min={format(subMonths(endDate, MAX_PERIOD), "yyyy-MM-dd")}
                max={format(endDate, "yyyy-MM-dd")}
                value={format(startDate, "yyyy-MM-dd")}
                onChange={(e) => {
                setStartDate(new Date(e.target.value))
                onFilteredByDate(new Date(e.target.value), endDate)
                }}
            />
            <input
                type="date"
                name="end date"
                max={format(new Date(), "yyyy-MM-dd")}
                value={format(endDate, "yyyy-MM-dd")}
                onChange={(e) => {
                setEndDate(new Date(e.target.value))
                onFilteredByDate(startDate, new Date(e.target.value))
                }}
            />
        </div>
    )
}