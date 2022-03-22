import React from 'react';
import { TextField } from '@mui/material';

import { style } from '../../styles/style';
const useStyles = style

export default function TextFieldItem({id, type, value, onChange}){
    const classes = useStyles();
    return(
        <form autoComplete="off" onSubmit={e => {e.preventDefault()}}>
        <TextField
            id={id}
            type={type}
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
       </form>
    )
}