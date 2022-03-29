import React from 'react';
import { TextField } from '@mui/material';

import { style } from '../../styles/style';
const useStyles = style

export default function TextFieldItem({id, type, value, onChange, defaultValue=true}){
    const classes = useStyles();
    return(
        <form autoComplete="off" onSubmit={e => {e.preventDefault()}}>
        {defaultValue ? (
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
            error={value === "" || value === undefined}
            defaultValue={value}
            onBlur={(e)=> onChange(e.target.value)}
       />
       ):(
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
            error={value === "" || value === undefined}
            value={value}
            onBlur={(e)=> onChange(e.target.value)}
        />
       )
        }
       </form>
    )
}