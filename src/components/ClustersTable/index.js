import React from 'react'
import { useCallback, useReducer, useState } from 'react'
import { style } from '../../styles/style'
import { Table, TableContainer, TableHead, TableRow, TableCell, TableBody, Button, TextField, FormControlLabel, Radio, IconButton, RadioGroup, Typography } from '@mui/material'
import CancelIcon from '@mui/icons-material/Cancel'
const useStyles = style

export default function ClustersTable({clusters, activeClusterIndex, dataClusterIndex, onChange, onActiveChange}) {
  const classes = useStyles()
  
  const [seq, increment] = useReducer((prev) => {return prev + 1}, 0)
  const addClusterHandler = useCallback(() => {
    if (typeof onChange === "function") {
      onChange([
        ...clusters,
        {
          id: seq,
          color: '#000'
        }
      ])
    }
    setFocus(seq)
    increment()
  }, [clusters, increment, onChange, seq])
  const [focus, setFocus] = useState()
  const onIdChange = useCallback(({target}, index) => {
    let cluster = clusters[index]
    setFocus(index)
    cluster.id = target.value
    if (typeof onChange === "function") {
      onChange([
        ...clusters.slice(0, index),
        cluster,
        ...clusters.slice(index + 1)
      ])
    }
  }, [clusters, setFocus, onChange])
  const onColorChange = useCallback(({target}, index) => {
    let cluster = clusters[index]
    cluster.color = target.value
    if (typeof onChange === "function") {
      onChange([
        ...clusters.slice(0, index),
        cluster,
        ...clusters.slice(index + 1)
      ])
    }
  }, [clusters, onChange])
  const deleteHandler = useCallback((index) => {
    if (window.confirm("Please confirm your delete request ?")) {
      onChange([
        ...clusters.slice(0, index),
        ...clusters.slice(index + 1)
      ])
    }
  }, [clusters, onChange])
  const activeChangeHandler = useCallback((index) => {
    if (typeof onActiveChange === "function") {
      onActiveChange(index)
    }
  }, [onActiveChange])
  return(
  // <table>
  //   <thead>
  //     <tr>
  //       <td></td>
  //       <td>Name</td>
  //       <td>Color</td>
  //       <td>Data points indices</td>
  //       <td></td>
  //     </tr>
  //   </thead>
  //   <tbody>
  //     {clusters?.length > 0 && clusters.map(({id, color}, index) => (
  //       <tr key={id}>
  //         <td><input checked={index === activeClusterIndex} type="radio" name="active" value={index} onChange={() => activeChangeHandler(index)}/></td>
  //         <td><input autoFocus={index === focus} type="text" value={id} onChange={e => onIdChange(e, index)} /></td>
  //         <td><input type="color" value={color} onChange={e => onColorChange(e, index)} /></td>
  //         <td>{Object.entries(dataClusterIndex).filter(([_, clusterIndex]) => clusterIndex === index).map(([i]) => i).join(",")}</td>
  //         <td style={{cursor: "pointer", color: 'red'}} onClick={() => deleteHandler(index)}>X</td>
  //       </tr>
  //     ))}
  //     <tr><td colSpan={4} style={{cursor: 'pointer'}} onClick={addClusterHandler}>Click to add more cluster</td></tr>
  //   </tbody>
  // </table>

<TableContainer className={classes.tableContainer} >
  <Table size="small" stickyHeader>
    <TableHead>
      <TableRow>
        <TableCell align="left" className={classes.tableCell} sx={{ minWidth: 5 }}></TableCell>
        <TableCell align="left" className={classes.tableCell}>Name</TableCell>
        <TableCell align="left" className={classes.tableCell}>Color</TableCell>
        {/* <TableCell align="left" className={classes.tableCell}>Data points indices</TableCell> */}
        <TableCell align="left" className={classes.tableCell}></TableCell>
      </TableRow>
    </TableHead>
    <TableBody>
    {clusters?.length > 0 && clusters.map(({id, color}, index) => (
      <TableRow key={id}>
        <TableCell align="left" className={classes.tableCell} sx={{ minWidth: 5 }}>
          <RadioGroup aria-label="gender" value={index} onChange={() => activeChangeHandler(index)}>
            <FormControlLabel 
                    control={<Radio style={{color:"#51b4ec"}} size="small" />} 
                    label=""
                    checked={index === activeClusterIndex}
            />
          </RadioGroup>
        </TableCell>
        <TableCell align="left" className={classes.tableCell}>
          <TextField
            fullWidth
            className={classes.textField}
            rows={1}
            autoFocus={index === focus} 
            type="text" 
            value={id} 
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
            onChange={e => onIdChange(e, index)}
            tabIndex={0}
          />
        </TableCell>
        <TableCell align="left" className={classes.tableCell}>
          <TextField
            fullWidth
            className={classes.textField}
            rows={1}
            type="color"
            value={color}
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
            onChange={e => onColorChange(e, index)}
            tabIndex={0}
          />
        </TableCell>
        {/* <TableCell align="left" className={classes.tableCell}>{Object.entries(dataClusterIndex).filter(([_, clusterIndex]) => clusterIndex === index).map(([i]) => i).join(",")}</TableCell> */}
        <TableCell align="left" className={classes.tableCell}>
          <IconButton onClick={() => deleteHandler(index)} >
            <CancelIcon style={{fontSize:'1rem', color:"#f04461", borderRadius:5}}></CancelIcon>
          </IconButton>
        </TableCell>
      </TableRow>
    ))} 
    <TableRow>
      <TableCell align="center" colSpan={4} style={{cursor: 'pointer'}} onClick={addClusterHandler} className={classes.tableCell}>
        <Button className={classes.defaultButton}><Typography className={classes.contentTextBlack}>Add more cluster</Typography></Button>
      </TableCell>
    </TableRow>
    </TableBody>
  </Table>
</TableContainer>
)
}