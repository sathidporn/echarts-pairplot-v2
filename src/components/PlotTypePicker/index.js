import React, { useCallback, useState } from 'react';
import { RadioGroup } from '@mui/material';
import { Radio } from '@mui/material';
import { FormControlLabel } from '@mui/material';

export default function PlotTypePicker({ onSelectedType = () => {} }){
    let [type, setType] = useState("scatter")
    const handleChangeType = useCallback((type) => {
        setType(type)
        onSelectedType(type)
    },[setType, onSelectedType])

    return(
        <>
        <RadioGroup aria-label="gender" value={type} onChange={(event) => handleChangeType(event.target.value)}>
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
        </RadioGroup>
        </>
    )
}