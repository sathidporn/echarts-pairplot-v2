import React from 'react'
import { useState, useCallback } from 'react';
import { Button, Grid, Typography, Tooltip } from '@mui/material';
import SpinnerWithBackdrop from '../Spinner';

import { style } from '../../styles/style';

import papa from 'papaparse'

const useStyles = style

export default function ImportSensorList({ onReadSensorListFile=()=>{}}) {
    const classes = useStyles();

    let [fileName, setFileName] = useState()
    let [content, setContent] = useState()
    let [loading, setLoading] = useState(false)

    // read csv file
    // read csv file
    const showTableHandler = useCallback((target) => {
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
    }, [setContent, setLoading, setFileName])

    // const onReadFile = useCallback((target) => {
    //     setFile(target.files[0])
    //     setFileName(target.files[0].name)
    // },[setFile, setFileName])

    // make content to obj 
    // const raw = useMemo(() => {
    //     if(content?.length > 0){
    //         console.log("content",content)
    //         onReadSensorListFile(content)
    //     }
    // },[content, onReadSensorListFile])

    const onSyncFile = useCallback(() => {
        console.log("content",content)
        onReadSensorListFile(content)
    }, [content, onReadSensorListFile])


    return(
        <>
        {loading &&
            <SpinnerWithBackdrop></SpinnerWithBackdrop>
        }
        <Grid item container xs={12} sm={12} md={12} lg={12} spacing={1} style={{padding:10}}>
            <Grid item xs={12} sm={4} md={4} lg={4} algin="left">
                <Typography className={classes.headerText}>sensor file : </Typography>
            </Grid>
            <Grid item xs={12} sm={4} md={4} lg={4} algin="left">
                <Tooltip title={fileName ? fileName : ""}>
                <Button
                    // variant="contained"
                    component="label"
                    className={classes.defaultButton}
                    >
                    {fileName ? (
                        <Typography className={classes.contentTextBlack}>{fileName.length > 10 ? `${fileName.slice(0,10)}...` : fileName}</Typography>
                    ):(
                        <Typography className={classes.contentTextBlack}>Choose File</Typography>
                    )}   
                    <input
                        id="file" 
                        name="file"
                        type="file"
                        accept="text/csv" 
                        required={true}
                        onChange={({target}) => showTableHandler(target)} 
                        hidden
                    />
                </Button>
                </Tooltip>
            </Grid>
            <Grid item xs={12} sm={4} md={4} lg={4} algin="left">
                <Button onClick={onSyncFile} className={classes.confirmButton}>
                    <Typography className={classes.contentTextWhite}>Import</Typography>
                </Button>
            </Grid>
        </Grid>  
        </> 
    )
}