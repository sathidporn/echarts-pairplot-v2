import React, { useCallback, useState } from 'react';
import { RadioGroup, Typography } from '@mui/material';
import { Radio } from '@mui/material';
import { FormControlLabel } from '@mui/material';
import { Grid } from '@mui/material';
import { style } from '../../styles/style';

const useStyles = style

export default function PlotTypePicker({ onSelectedType = () => {} }){
    let classes = useStyles();
    let [type, setType] = useState("scatter")
    const handleChangeType = useCallback((type) => {
        setType(type)
        onSelectedType(type)
    },[setType, onSelectedType])

    return(
        <>
        <Grid item container xs={12} sm={12} md={12} lg={12}>
            <Grid item xs={12} sm={3} md={3} lg={3} alignContent="center" alignItems="center" alignSelf="center">
                <Typography className={classes.blueText}>PLOT TYPE : </Typography>
            </Grid>
            <Grid item xs={12} sm={9} md={9} lg={9} alignContent="center" alignItems="center" alignSelf="center">
                <RadioGroup row aria-label="type" value={type} onChange={(event) => handleChangeType(event.target.value)}>
                    <FormControlLabel 
                        value="scatter" 
                        control={<Radio style={{color:"#51b4ec"}} size="small" />} 
                        label={"Scatter"}
                    />
                    <FormControlLabel 
                        value="line" 
                        control={<Radio style={{color:"#51b4ec"}} size="small" />} 
                        label={"Line"}
                    />  
                    {/* <FormControlLabel 
                        value="kde" 
                        control={<Radio style={{color:"#51b4ec"}} size="small" />} 
                        label={"KDE"}
                    />   */}
                </RadioGroup>
            </Grid>
        </Grid>
        </>
    )
}