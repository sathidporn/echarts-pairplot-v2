import React from 'react'
import { useState, useCallback } from 'react';
import { Button, Grid, Typography, Tooltip } from '@mui/material';
import SpinnerWithBackdrop from '../Spinner';

import { style } from '../../styles/style';

import papa from 'papaparse'
import {parse} from 'papaparse'

const useStyles = style

export default function ImportData({ onRawDataHandler=()=>{}}) {
    const classes = useStyles();

    let [fileName, setFileName] = useState()
    let [content, setContent] = useState()
    let [data, setData] = useState([])
    let [loading, setLoading] = useState(false)

    // read csv file
    // const showTableHandler = useCallback(() => {
  
    // }, [file, setContent, setLoading])

    const onReadFile = useCallback((target) => {
        // setFile(target.files[0])
        setFileName(target.files[0].name)
        let reader = new FileReader()
        reader.readAsText(target.files[0])
        setLoading(true)
        reader.onload = e => {
            let csv = e.target.result
            setContent(
            papa.parse(csv, {
                header: true
            }).data
            )
            setLoading(false)
        }  
        parse(target, {
            delimiter: ",",
            header: true,
            // worker: true,
            transform(value, header) {
              if (header === "TimeStamp") return new Date(value)
              else return Number.parseFloat(value)
            },
            complete(result) {
            //   setTags(result.meta.fields)
              setData(result.data.filter(row => Object.values(row).findIndex(Number.isNaN) === -1))
            }
        })
    },[setContent, setLoading, setFileName])

    // make content to obj 
    const showTableHandler = useCallback(() => {
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
                }): raw[element] = values.map(i=> { return i !== null || i !== undefined ? Number(i) : 0})
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
            onRawDataHandler(Object.keys(content[0]), raw, data, uniqueIndexs, uniqueTimestamps)
            return raw
        }
    },[content, data, onRawDataHandler])

    return(
        <>
        {loading &&
            <SpinnerWithBackdrop></SpinnerWithBackdrop>
        }
        <Grid item container xs={12} sm={12} md={12} lg={12} spacing={1} style={{padding:10}}>
            {/* <Grid item xs={12} sm={4} md={4} lg={4} algin="left">
                <Typography className={classes.headerTextBlue}>Raw Data : </Typography>
            </Grid> */}
            <Grid item xs={12} sm={6} md={6} lg={6} algin="left">
                <Tooltip title={fileName ? fileName : ""}>
                <Button
                    // variant="contained"
                    component="label"
                    className={classes.defaultButton}
                    >
                    {fileName ? (
                        <Typography className={classes.contentTextBlack}>{fileName.length > 10 ? `${fileName.slice(0,10)}...` : fileName}</Typography>
                    ):(
                        <Typography className={classes.contentTextBlack}>Choose</Typography>
                    )}   
                    <input
                        id="file" 
                        name="file"
                        type="file"
                        accept="text/csv" 
                        required={true}
                        onChange={({target}) => onReadFile(target)} 
                        hidden
                    />
                </Button>
                </Tooltip>
            </Grid>
            <Grid item xs={12} sm={6} md={6} lg={6} algin="left">
                <Button onClick={showTableHandler} className={classes.confirmButton}>
                    <Typography className={classes.contentTextWhite}>Upload</Typography>
                </Button>
            </Grid>
        </Grid>  
        </> 
    )
}