import React from 'react';
import { TextField } from '@mui/material';

import { style } from '../../styles/style';
const useStyles = style

export default function TextFieldItem({id, value, onChange}){
    const classes = useStyles();
    return(
        <TextField
            id={id}
           fullWidth
           className={classes.textField}
           rows={1}
           InputLabelProps={{
               shrink: true,
               className: classes.textField
           }}
           InputProps={{
               classes:{
                   root: classes.textField,
                   disabled: classes.textField
               }
           }}
           variant="outlined"
           tabIndex={0}
           defaultValue={value}
           onBlur={(e)=> onChange(e.target.value)}
       />
    )
}