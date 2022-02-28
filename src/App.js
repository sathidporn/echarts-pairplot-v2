import './App.css';
import {useCallback, useReducer, useState, useMemo} from 'react'


// import { generateRandomSeries, generateSequence } from './utils/data_generator';

import PairPlot from './components/PairPlot';
import LinePlot from './components/LinePlot'
import ClustersTable from './components/ClustersTable';
import ClusterRange from './components/ClusterRange';
import SensorsTable from './components/SensorsTable'
import { Accordion, AccordionDetails, AccordionSummary, Grid } from '@mui/material';
import DatePicker from './components/DatePicker';
import PlotTypePicker from './components/PlotTypePicker';
import ImportData from './components/ImportData';
import AddSensor from './components/AddSensor';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { style } from './styles/style';
import { generateSpecialSensor } from './utils/calculate_sensor';

const useStyles = style

// const seriesConfigs = {
//   "seriesA": {n: 256},
//   "seriesB": {n: 256, min: 10, max: 15},
//   "seriesC": {n: 256, min: 95, max: 105},
//   "seriesD": {n: 256, min: 1000, max: 1001},
// }
const defaultCluster = {
  id: "default",
  color: "#00ff00"
}
function App() {
  // let series = useMemo(() => {
  //   let temp = {}
  //   for (let [key, value] of Object.entries(seriesConfigs)) {
  //     temp[key] = generateRandomSeries(value)
  //   }
  //   return temp
  // }, [])
  // let timeseries = useMemo(() => {
  //   return generateSequence({n: 256})
  // }, [])
  // console.log("series",series)
  // console.log("timeseries",timeseries)

  // series from csv file

  const classes = useStyles();

  let [series, setSeries] = useState()

  const [clusters, setClusters] = useState([defaultCluster])
  const clustersChangeHandler = useCallback(clusters => {
    setClusters(clusters)
  }, [setClusters])

  const [activeClusterIndex, setActiveClusterIndex] = useState(0)
  const activeClusterChangeHandler = useCallback(index => {
    setActiveClusterIndex(index)
  }, [setActiveClusterIndex])

  const [brushingMode, setBrushingMode] = useState(false)
  const [dataClusterIndex, updateDataClusterIndex] = useReducer(
    (state, payload) => {
      // console.log("updateDataClusterIndex", brushingMode, state, payload)
      if (brushingMode === false) return state
      let changed = false
      // First pass, reset all cluster index of current active cluster selection
      let newDataClusterIndex = state.map(i => {
        if (i === activeClusterIndex) {
          changed = true
          return -1
        } else return i
      })
      // Second pass, set all selected index to current active cluster
      if (payload !== undefined && payload.length > 0) {
        changed = true
        payload.forEach(index => {
          newDataClusterIndex[index] = activeClusterIndex
        })
      }
      if (changed) {
        return newDataClusterIndex
      } else {
        return state
      }
    }, 
    series ? Object.values(series)[0].map(() => -1) : []
    // Object.values(series)[0].map(() => -1)
  )

  const brushActivateHandler = useCallback(() => {
    setBrushingMode(true)
  }, [setBrushingMode])
  const brushDeactivateHandler = useCallback(() => {
    setBrushingMode(false)
  }, [setBrushingMode])
  const onSelected = useCallback(index => {
    // console.log("index",index)
    updateDataClusterIndex(index)
  }, [updateDataClusterIndex])


// start to filter series and timestamps by sensor and date
  let [plotType, setPlotType] = useState("scatter")
  const onSelectedType = useCallback((type) => {
    setPlotType(type)
  },[setPlotType])

  let [raw, setRaw] = useState()
  let [checkedSensors, setCheckedSensors] = useState([])
  let [sensorsObj, setSensorsObj] = useState()
  let [timestampsIndex, setTimestampsIndex] = useState()
  let [timestampsAxis, setTimestampsAxis] = useState()
  let [startDate, setStartDate] = useState()
  let [endDate, setEndDate] = useState()

  const onGetRawData = useCallback((columns, raw, timestampsIndex, timestampsAxis) => {
    setRaw(raw)
    setTimestampsIndex(timestampsIndex)
    setTimestampsAxis(timestampsAxis)
    let tempArray = []
    let temp = {}
    for (let sensor of columns) {
      if(sensor!== "TimeStamp"){
        temp[sensor] = {tag: sensor, checked: false, sampling: "mean"}
        tempArray.push(temp[sensor])
      }
    }
    setSensorsObj(tempArray)
  }, [setRaw, setTimestampsIndex, setTimestampsAxis, setSensorsObj])

  // const onFilteredBySensors = useCallback((series, timeseries) => {
  const onFilteredBySensors = useCallback((tag, values,  checkedSensors, newSensorsObj ) => {
    // console.log("new", checkedSensors, newSensorsObj)
    let newSeries = {}
    // get tag and values of sensor for merge to sensor obj
    if( tag && values){
      if(series === undefined){
        newSeries[tag] = values
      }else{
        let newObj = {}
        newObj[tag] = values
        newSeries = Object.assign(series, newObj);
      }
    }
    // filtered all series by sensor array
    const filteredSeries = Object.keys(newSeries).filter(key => checkedSensors.includes(key)).reduce((obj, key) => {
      obj[key] = newSeries[key]
      return obj
    }, {})
    if(Object.keys(filteredSeries).length > 0){
      setSeries(filteredSeries)
      updateDataClusterIndex(Object.values(filteredSeries)[0].map(() => -1)) 
    }
    else{
      setSeries(undefined)
    }
    setCheckedSensors(checkedSensors)
    setSensorsObj(newSensorsObj)
    // console.log("by sensor / series",filteredSeries)
   
  },[series, setSeries, updateDataClusterIndex, setCheckedSensors, setSensorsObj])
  
  const onFilteredByDate = useCallback((startDate, endDate) => {
    let filteredTimestamps = []
    let filteredSeries = {}
    // filtered current timestamps by start date and end date
    for (let i = 0; i < timestampsAxis.length; i++) {
      if (timestampsAxis[i] >= startDate && timestampsAxis[i] <= endDate) {
        filteredTimestamps.push(timestampsAxis[i])
      }  
    }
    // filtered series of current sensor obj by start date and end date
    checkedSensors.map((sensor) => {
      let values = []
      for (let i = 0; i < timestampsAxis.length; i++) {
        if (timestampsAxis[i] >= startDate && timestampsAxis[i] <= endDate) {
          values.push(series[sensor][i])
          filteredSeries[sensor] = values
        }
      }
      return values 
    })
    if(Object.keys(filteredSeries).length > 0){
      setSeries(filteredSeries)
      // setTimeSeries(filteredTimestamps)
      setTimestampsAxis(filteredTimestamps)
      updateDataClusterIndex(Object.values(filteredSeries)[0].map(() => -1)) 
    }else{
      console.error("series null");
    }
    setStartDate(startDate)
    setEndDate(endDate)
    // console.log("by date / series",filteredSeries)
  }, [checkedSensors, series, timestampsAxis, setSeries, setTimestampsAxis, setStartDate, setEndDate, updateDataClusterIndex])

  const onFeatureSensor = useCallback((newSensor) => {
    // console.log("objNewSensor",newSensor)
    let newObj = {}
    let result = generateSpecialSensor({raw, newSensor})
    newObj[`${newSensor.name}`] = result
    setRaw(Object.assign(newObj,raw))
    setSensorsObj([{tag: `${newSensor.name}`, checked: false, sampling: "mean"}, ...sensorsObj])

  },[raw, sensorsObj, setRaw, setSensorsObj])
  // end


  const onTestClusterRange = useCallback((clusterIndexArr, clusters) => {
    console.log("test",clusterIndexArr)
    updateDataClusterIndex(clusterIndexArr)
    setClusters(clusters)
  }, [updateDataClusterIndex, setClusters])

  return (
    <div className="App">
    <Grid item container lg={12} spacing={1}>
      <Grid item lg={3}>
        <div className={classes.toolbox}>
          <Accordion defaultExpanded={true} disableGutters={true}>
            <AccordionSummary  className={classes.accordionSummary}  expandIcon={<ExpandMoreIcon className={classes.accordionIcon} />}>
              Upload data
            </AccordionSummary>
            <AccordionDetails className={classes.accordionDetail}>
              <ImportData onGetRawData={onGetRawData}></ImportData>
            </AccordionDetails>
          </Accordion>

          {raw &&
            <>
          <Accordion disableGutters={true}>
            <AccordionSummary className={classes.accordionSummary} expandIcon={<ExpandMoreIcon className={classes.accordionIcon} />}>
              Select date 
            </AccordionSummary>
            <AccordionDetails className={classes.accordionDetail}>
              <DatePicker startSeries={raw['TimeStamp'][0]} endSeries={raw['TimeStamp'][raw['TimeStamp']?.length-2]} onFilteredByDate={onFilteredByDate} ></DatePicker>
            </AccordionDetails>
          </Accordion>

          <Accordion>
            <AccordionSummary className={classes.accordionSummary} expandIcon={<ExpandMoreIcon className={classes.accordionIcon} />}>
              Select type
            </AccordionSummary>
            <AccordionDetails className={classes.accordionDetail}>
              <PlotTypePicker onSelectedType={onSelectedType}></PlotTypePicker>
            </AccordionDetails>
          </Accordion>

          <Accordion>
            <AccordionSummary className={classes.accordionSummary} expandIcon={<ExpandMoreIcon className={classes.accordionIcon} />}>
              Select sensors
            </AccordionSummary>
            <AccordionDetails className={classes.accordionDetail}>
              <SensorsTable sensorsObj={sensorsObj} checkedSensors={checkedSensors} raw={raw} timestampsIndex={timestampsIndex} onFilteredBySensors={onFilteredBySensors}></SensorsTable>
            </AccordionDetails>
          </Accordion>

          <Accordion>
            <AccordionSummary className={classes.accordionSummary} expandIcon={<ExpandMoreIcon className={classes.accordionIcon} />}>
              Feature Sensor
            </AccordionSummary>
            <AccordionDetails className={classes.accordionDetail}>
              <AddSensor sensorsObj={sensorsObj} raw={raw} onFeatureSensor={onFeatureSensor} ></AddSensor>
            </AccordionDetails>
          </Accordion>

          {series && plotType === "scatter" &&
          <Accordion defaultExpanded={true}>
            <AccordionSummary className={classes.accordionSummary} expandIcon={<ExpandMoreIcon className={classes.accordionIcon} />}>
              Cluster
            </AccordionSummary>
            <AccordionDetails className={classes.accordionDetail}>
              <Grid item container lg={12} spacing={1}>
                <Grid item lg={12}>
                  <ClustersTable clusters={clusters} onChange={clustersChangeHandler} activeClusterIndex={activeClusterIndex} onActiveChange={activeClusterChangeHandler} dataClusterIndex={dataClusterIndex} />
                </Grid>
                <Grid item lg={12}>
                  <ClusterRange checkedSensors={checkedSensors} timestampsAxis={timestampsAxis} series={series} onBrushActivate={brushActivateHandler} onTestClusterRange={onSelected}></ClusterRange>
                </Grid>
              </Grid>
            </AccordionDetails>
          </Accordion>
          }
          </>
          }
        </div>
        
            {/* <DatePicker startSeries={raw['TimeStamp'][0]} endSeries={raw['TimeStamp'][raw['TimeStamp']?.length-2]} onFilteredByDate={onFilteredByDate} ></DatePicker>
            <PlotTypePicker onSelectedType={onSelectedType}></PlotTypePicker>
            <SensorsTable sensorsObj={sensorsObj} checkedSensors={checkedSensors} raw={raw} timestampsIndex={timestampsIndex} onFilteredBySensors={onFilteredBySensors}></SensorsTable>
            <ClustersTable clusters={clusters} onChange={clustersChangeHandler} activeClusterIndex={activeClusterIndex} onActiveChange={activeClusterChangeHandler} dataClusterIndex={dataClusterIndex} />
            <AddSensor sensorsObj={sensorsObj} raw={raw} onFeatureSensor={onFeatureSensor} ></AddSensor> */}
      
      </Grid>
      <Grid item lg={9}>
        {series &&
        <>
        {plotType === "scatter" &&
        <PairPlot style={{width: '100vw', height: '100vh'}} timeseriesAxis={timestampsAxis} series={series} clusters={clusters} dataClusterIndex={dataClusterIndex} onBrushActivate={brushActivateHandler} onBrushDeactivate={brushDeactivateHandler} onSelected={onSelected} />
        }
        {plotType === "line" &&
        <LinePlot style={{width: '80vw', height: '80vh'}} timeseriesAxis={timestampsAxis} series={series} startDate={startDate} endDate={endDate} sensors={checkedSensors} clusters={clusters} dataClusterIndex={dataClusterIndex}></LinePlot>
        }
        </>
        }
      </Grid>
    </Grid> 
    </div>
  );
}

export default App;
