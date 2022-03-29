import React from 'react';
import { Select, MenuItem } from '@mui/material';
import ArrowDropDownCircleIcon from '@mui/icons-material/ArrowDropDownCircle';

import { style } from '../../styles/style';
const useStyles = style

export default function SelectorItem({id, value, items, onChange}){
    const classes = useStyles();
    return(
    <Select
        id={id}
        value={value}
        IconComponent = {ArrowDropDownCircleIcon}
        autoFocus={true}
        error={value === "select"}
        inputProps={{
            classes: {
                icon: classes.selector,
                root: classes.selector,
            },
        }}   
        className={classes.selector}  
        MenuProps={{
            classes:{
                list: classes.menuItem
            }
        }}  
        onChange={(e) => onChange(e.target.value)}   
    >
        {items.map((item) => {
            return(
            <MenuItem key={item.value} value={item.value} className={classes.menuItem}>{item.name}</MenuItem>
            )
        })}
    </Select>
    )
}