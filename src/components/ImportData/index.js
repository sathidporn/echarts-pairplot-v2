import React from 'react'
import { useState, useCallback, useMemo } from 'react';
import { Button, Grid, Typography } from '@mui/material';

import { style } from '../../styles/style';

import papa from 'papaparse'

const useStyles = style

export default function ImportData({ onGetRawData=()=>{}}) {
const classes = useStyles();

let [file, setFile] = useState()
let [fileName, setFileName] = useState()
let [content, setContent] = useState()

// read csv file
const showTableHandler = useCallback(() => {
    let reader = new FileReader()
    reader.readAsText(file)
    reader.onload = e => {
        let csv = e.target.result
        setContent(
        papa.parse(csv, {
            header: true
        }).data
        )
    }
}, [file, setContent])

// make content to obj 
const raw = useMemo(() => {
    if(content?.length > 0){
        var raw = {}
        Object.keys(content[0]).map((element)=>{
            let values = []
            content.map((row, index) => {
                return values.push(row[element])
            })
            return element === "TimeStamp" ? raw[element] = values.map( i => {
                // set minute and second to 0
                let date = new Date(i)
                date.setMinutes(0)
                date.setSeconds(0)
                return date
            }) : raw[element] = values.map(i=>Number(i))
        })    

        // find unique timestamps and index of unique timestamps
        var uniqueTimestamps = [raw["TimeStamp"][0]]
        var curTimestamp = raw["TimeStamp"][0]
        var uniqueIndexs = [0]
        for (let i = 0; i < raw["TimeStamp"].length; i++) {
            if(raw["TimeStamp"][i] > curTimestamp){
                curTimestamp = raw["TimeStamp"][i]
                uniqueTimestamps.push(raw["TimeStamp"][i])
                // curIndex = i
                uniqueIndexs.push(i)
            }
        }

        onGetRawData(Object.keys(content[0]),raw, uniqueIndexs, uniqueTimestamps)
        return raw
    }

},[content, onGetRawData])

const onGetFile = useCallback((target) => {
    setFile(target.files[0])
    setFileName(target.files[0].name)
},[setFile, setFileName])


    return(
        <Grid item container xs={12} sm={12} md={12} lg={12} spacing={1} style={{padding:10}}>
            <Grid item xs={6} sm={6} md={6} lg={6} algin="left">
                {/* <Input 
                    id="file" 
                    name="file"
                    type="file" 
                    accept="text/csv" 
                    onChange={({target}) => setFile(target.files[0])} 
                    className={classes.inputFile}
                    required={true}
                    disableUnderline={true}
                /> */}
                <Button
                    // variant="contained"
                    component="label"
                    className={classes.button}
                    >
                    { fileName ? `${fileName}` : `Choose File`}
                    <input
                        type="file"
                        accept="text/csv" 
                        onChange={({target}) => onGetFile(target)} 
                        hidden
                    />
                </Button>

            </Grid>
            <Grid item xs={6} sm={6} md={6} lg={6} algin="left">
                <Button
                    onClick={showTableHandler} 
                    className={classes.button}
                >
                    Upload Data
                </Button>
            </Grid>
        </Grid>   
    )
}