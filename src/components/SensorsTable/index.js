import papa from 'papaparse'
import React from 'react';
import Grid from '@material-ui/core/Grid'
import { useCallback, useMemo, useState } from 'react';
import DatePicker from '../DatePicker';

export default function SensorsData({ onGetSeries = () => { }}) {

  // read csv file
  let [file, setFile] = useState()
  let [content, setContent] = useState()
  let [showSensors, setShowSensors] = useState(false)

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
    setShowSensors(!showSensors)
  }, [file, setContent, showSensors, setShowSensors])

  // make content to obj 
  const raw = useMemo(() => {
    if(content?.length > 0){
      var columns = {}
      Object.keys(content[0]).map((sensor)=>{
        let values = []
        content.map((row, index) => {
          return values.push(row[sensor])
        })
        return columns[sensor] = values
      })
      return columns
    }
  },[content])

  // filtered data by sensors
  let [sensors, setSensors] = useState([])
  let [series, setSeries] = useState([])
  const onAddSensors = useCallback ((name,checked) => {
    let newSensors
    if(checked){
      newSensors = [...sensors, name]
      setSensors(newSensors)
    }else{
      newSensors = sensors.filter(sensor => sensor !== name)
      setSensors(newSensors)
    }
    const filtered = Object.keys(raw).filter(key => newSensors.includes(key)).reduce((obj, key) => {
      obj[key] = raw[key].map(i=>Number(i))
      return obj
    }, {})
    onGetSeries(filtered, raw["TimeStamp"])
    setSeries(filtered)
  },[raw, sensors, setSensors, setSeries, onGetSeries])

  // const onFilteredByDate = useCallback((startDate, endDate) => {
  //   if(raw){

  //     const data =  Object.entries(raw).filter(r=> new Date(r['TimeStamp']) >= startDate && new Date(r['TimeStamp']) <= endDate)
  //     console.log("filtered",data)
  //     // const data = raw.map(s => {
  //     //   const date = new Date(s['TimeStamp'])
  //     //   return (date >= startDate && date <= endDate)
  //     // })
  //     // onGetSeries(data)
  //   }
  // }, [raw])

  return (
    <div className="App">
      <Grid item container lg={12} spacing={1} style={{padding:10}}>
        <Grid item lg={6} algin="left">
          <input type="file" accept="text/csv" onChange={({target}) => setFile(target.files[0])}/>
        </Grid>
        <Grid item lg={6} algin="left">
          <input type="button" onClick={showTableHandler} value={showSensors ? "Hide sensors" : "Show sensors"}/>
        </Grid>

        {/* {raw &&
        <Grid item lg={12} algin="left">
          <DatePicker startSeries={raw['TimeStamp'][0]} endSeries={raw['TimeStamp'][raw['TimeStamp']?.length-2]} onFilteredByDate={onFilteredByDate} ></DatePicker>
        </Grid>
        } */}

        {content?.length > 0 && showSensors && 
        <Grid item lg={12}>
            <div style={{overflowY: 'auto', overflowX: 'auto', height: 750}} >
            <table style={{border: "1px solid black"}}>
              <thead>
                <tr style={{border: "1px solid black"}}>
                  <td style={{border: "1px solid black"}}>Sensor</td>
                </tr>
              </thead>
              <tbody>
                {Object.keys(content[0]).map(name => {
                  return(
                    <tr key={name} style={{border: "1px solid black"}} align="left"><input type="checkbox" onChange={(e)=>onAddSensors(name,e.target.checked)}/>{name}</tr>
                  )
                })}
              </tbody>
            </table>
            </div>
        </Grid>
        }
      </Grid>
    </div>
  );
}

