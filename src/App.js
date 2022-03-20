import './App.css';
import * as React from 'react';
import {useCallback, useReducer, useState, useMemo } from 'react'
import { Accordion, AccordionDetails, AccordionSummary, Grid } from '@mui/material';
import Box from '@mui/material/Box';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import StepContent from '@mui/material/StepContent';
import Button from '@mui/material/Button';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import AddCircleIcon from '@mui/icons-material/AddCircle';

import PairPlot from './components/PairPlot';
import LinePlot from './components/LinePlot'
import ClustersTable from './components/ClustersTable';
import IndicationSensor from './components/IndicationSensor';
import SensorPicker from './components/SensorPicker'
import DatePicker from './components/DatePicker';
import PlotTypePicker from './components/PlotTypePicker';
import ImportData from './components/ImportData';
import AddFeatureSensor from './components/AddFeatureSensor';
import SamplingPicker from './components/SamplingPicker';
// import { KDEPlot } from './components/KDEPlot';

import { generateSamplingData } from './utils/data_sampling';
import { generateSpecialSensor } from './utils/calculate_sensor';
import { cleansingSensors, cleansingTimestamps } from './utils/data_cleansing';
import { style } from './styles/style';

// import * as tf from '@tensorflow/tfjs'
// require('@tensorflow/tfjs-backend-webgl')


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

const steps = [
  {
    label: 'Upload raw data',
    description: `Raw data file should be .csv format and this file must cleaned data such as bad text, null value, etc... `,
  },
  {
    label: 'Select sampling type',
    description:
      'When selected sampling it will sampling raw data to 1 hour rate',
  },
  {
    label: 'Filter data',
    description: `User can filtering data use indicator sensor`,
  },
  {
    label: 'Select sensor',
    description: `Select sensor and date to plot graph`,
  },
];

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
  const [activeStep, setActiveStep] = React.useState(0);

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleReset = () => {
    setActiveStep(0);
  };
  
  let [raw, setRaw] = useState()
  let [timestampsIndex, setTimestampsIndex] = useState()
  let [content, setContent] = useState([])

  let [timestampsAxis, setTimestampsAxis] = useState()
  let [samplingData, setSamplingData] = useState()
  let [samplingTimestamp, setSamplingTimestamp] = useState()
  let [filteredSensors, setFilteredSensors] = useState()
  let [filteredTimestamps, setFilteredTimestamps] = useState()

  let [checkedSensors, setCheckedSensors] = useState([])
  let [sensorsObj, setSensorsObj] = useState()
  let [series, setSeries] = useState()

  let [startDate, setStartDate] = useState()
  let [endDate, setEndDate] = useState()
  let [filterProcess, setFilterProcess] = useState({tag: undefined, operator: undefined, firstValue: undefined, secondValue: undefined})

  // let [samplingType, setSamplingType] = useState()
  // let [filterProcess, setFilterProcess] = useState({tag: undefined, operator: undefined, value1: undefined, value2: undefined})

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

  const onRawDataHandler = useCallback((columns, raw, data, timestampsIndex, timestamps) => {
    setRaw(raw)
    setContent(data)
    setTimestampsIndex(timestampsIndex)
    setSamplingTimestamp(timestamps)
    // setTimestampsAxis(timestampsAxis)
    let sensorsArray = []
    let sensors = {}
    for (let sensor of columns) {
      if(sensor!== "TimeStamp"){
        sensors[sensor] = {tag: sensor, checked: false, name: "", description: "", type: "", unit: "", method: "", component: ""}
        sensorsArray.push(sensors[sensor])
      }
    }
    setSensorsObj(sensorsArray)
    setSeries(undefined)
    console.log("Import",columns, raw, timestamps)
  }, [setRaw, setContent, setTimestampsIndex, setSamplingTimestamp, setSensorsObj, setSeries])

  const onSamplingData = useCallback((type) => {
    let updateSamplingData = {}
      sensorsObj.map((sensor) => {
        let values = []
        let result
        for (let i = 0; i < timestampsIndex.length; i++) {
            let start = timestampsIndex[i]
            let end = timestampsIndex[i+1]
            let valuesArr = raw[sensor.tag].slice(start,end)
            result = generateSamplingData({valuesArr, type})
            values.push(result)
        }
        if(values){
            let newObj = {}
            newObj[sensor.tag] = values
            updateSamplingData = Object.assign(updateSamplingData, newObj);
        }
        return values
      })
      setSamplingData(updateSamplingData)
 
      // update filteredSensors, filteredTimestamps, series and timestamps when sampling type changed
      if(checkedSensors.length > 0){
        let updateTimestamps = cleansingTimestamps({ tag: filterProcess.tag, operator: filterProcess.operator, value1: filterProcess.firstValue, value2: filterProcess.secondValue, samplingData: updateSamplingData, samplingTimestamp})
        let updateSensors = cleansingSensors({ tag: filterProcess.tag, operator: filterProcess.operator, value1: filterProcess.firstValue, value2: filterProcess.secondValue, sensorsObj, samplingData: updateSamplingData, samplingTimestamp})
        setFilteredTimestamps(updateTimestamps)
        setFilteredSensors(updateSensors)
        const updateSeries = Object.keys(updateSensors).filter(key => checkedSensors.includes(key)).reduce((obj, key) => {
          obj[key] = updateSensors[key]
          return obj
        }, {})
        if(Object.keys(updateSeries).length > 0){
          setSeries(updateSeries)
          updateDataClusterIndex(Object.values(updateSeries)[0].map(() => -1)) 
        }
        else{
          setSeries(undefined)
        }  
      }
    console.log("Sampling",updateSamplingData)
  },[checkedSensors, sensorsObj, timestampsIndex, raw, filterProcess, samplingTimestamp, setSamplingData, setSeries])

  const onFilterByIndicator = useCallback((tag, operator, value1, value2) => {
    console.log("Cleansing/sampling",samplingData,samplingTimestamp)
    let updateTimestamps = cleansingTimestamps({tag, operator, value1, value2, samplingData, samplingTimestamp})
    let updateSensors = cleansingSensors({tag, operator, value1, value2, sensorsObj, samplingData, samplingTimestamp})
    setFilteredTimestamps(updateTimestamps)
    setFilteredSensors(updateSensors)
    setFilterProcess({tag: tag, operator: operator, firstValue: value1, secondValue: value2})

    // update series when filter process changed
    if(checkedSensors.length > 0){
      const updateSeries = Object.keys(updateSensors).filter(key => checkedSensors.includes(key)).reduce((obj, key) => {
        obj[key] = updateSensors[key]
        return obj
      }, {})
      if(Object.keys(updateSeries).length > 0){
        setSeries(updateSeries)
        updateDataClusterIndex(Object.values(updateSeries)[0].map(() => -1)) 
      }
      else{
        setSeries(undefined)
      }  
    }
    console.log("Cleansing",updateTimestamps,updateSensors)
  }, [sensorsObj, checkedSensors, samplingData, samplingTimestamp, setFilteredSensors, setFilteredTimestamps, setFilterProcess, setSeries])

  const onPickedSensors = useCallback((tag, checkedSensors, newSensorsObj ) => {
    // add new sensor series 
    let addNewSeries = {}
    if(tag){
      if(series === undefined){
        addNewSeries[tag] = filteredSensors[tag]
      }else{
        let newObj = {}
        newObj[tag] = filteredSensors[tag]
        addNewSeries = Object.assign(series, newObj);
      }
    }
    // update new series when picked sensor
    const updateSeries = Object.keys(addNewSeries).filter(key => checkedSensors.includes(key)).reduce((obj, key) => {
      obj[key] = addNewSeries[key]
      return obj
    }, {})
    if(Object.keys(updateSeries).length > 0){
      setSeries(updateSeries)
      updateDataClusterIndex(Object.values(updateSeries)[0].map(() => -1)) 
    }
    else{
      setSeries(undefined)
    }
    setCheckedSensors(checkedSensors)
    setSensorsObj(newSensorsObj)
    console.log("PickSensor",updateSeries)
  },[filteredSensors, series, setSeries, updateDataClusterIndex, setCheckedSensors, setSensorsObj])

  const onPickedDate = useCallback((startDate, endDate) => {
    setStartDate(startDate)
    setEndDate(endDate)
    // update timestamps by start date and end date
    let updateTimestamps = []
    for (let i = 0; i < filteredTimestamps.length; i++) {
      if (filteredTimestamps[i] >= startDate && filteredTimestamps[i] <= endDate) {
        updateTimestamps.push(filteredTimestamps[i])
      }  
    }
    setFilteredTimestamps(updateTimestamps)
    // update series of current sensor obj by start date and end date
    let updatedSeries = {}
    checkedSensors.map((sensor) => {
      let values = []
      for (let i = 0; i < filteredTimestamps.length; i++) {
        if (filteredTimestamps[i] >= startDate && filteredTimestamps[i] <= endDate) {
          values.push(series[sensor][i])
          updatedSeries[sensor] = values
        }
      }
      return values 
    })
    if(Object.keys(updatedSeries).length > 0){
      setSeries(updatedSeries)
      updateDataClusterIndex(Object.values(updatedSeries)[0].map(() => -1)) 
    }else{
      console.error("series null");
    }
    console.log("PickDate",startDate, endDate, updatedSeries)
  }, [checkedSensors, series, filteredTimestamps, setSeries, setStartDate, setEndDate, updateDataClusterIndex])

  // const kdeData = useMemo(() => {
  //   let selectedData = content.map(row => Object.entries(row).filter(([key]) => checkedSensors.indexOf(key) !== -1).map(([_, value]) => value))
  //   console.log("selected",selectedData)
  //   return tf.tensor(selectedData)
  // }, [checkedSensors, content])

  const onAddFeatureSensor = useCallback((featureSensor) => {
    // add new feature sensor to raw
    let featureSensorObj = {}
    let featureSensorData = generateSpecialSensor({filteredSensors, featureSensor})
    featureSensorObj[`${featureSensor.tag}`] = featureSensorData
    let updateFilteredSensors = Object.assign(featureSensorObj, filteredSensors)
    setFilteredSensors(updateFilteredSensors)
    setSensorsObj([...sensorsObj, {status: "new", tag: `${featureSensor.tag}`, checked: false, name: `${featureSensor.name}`, description: "", type: "", unit: "", method: `${featureSensor.calType}`, component: ""}])
    console.log("Feature",featureSensorObj)
  },[filteredSensors, sensorsObj, setFilteredSensors, setSensorsObj])

  const onUpDateSensors = useCallback((updateSensors) => {
    setSensorsObj(updateSensors)
  }, [setSensorsObj])

// end

  return (
    <div className="App">
    <Grid item container xs={12} sm={12} md={12} lg={12} spacing={1}>
      <Grid item container xs={3} sm={3} md={3} lg={3} className={classes.toolbox} direction="row" justifyContent="flex-end">
      {/* <div className={classes.toolbox}> */}
        <Grid item  xs={12} sm={12} md={12} lg={12}>
          <Box sx={{ maxWidth: 500}}>
            <Stepper activeStep={activeStep} orientation="vertical">
              {steps.map((step, index) => (
                <Step key={step.label} className={classes.stepLabel}>
                  <StepLabel
                    // optional={
                    //   index === 2 ? (
                    //     <Typography variant="caption" className={classes.headerText}>Last step</Typography>
                    //   ) : null
                    // }
                    StepIconProps={{
                      classes: {
                          root: classes.stepper,
                          text: classes.stepper,
                          active: classes.activeIcon,
                          completed: classes.completedIcon,
                      }
                    }}
                  >
                    <Typography variant="caption" className={classes.headerTextWhite}>{step.label}</Typography>
                  </StepLabel>
                  <StepContent TransitionProps={{ unmountOnExit: false }}>
                    {/* <Typography>{step.description}</Typography> */}
                    {index === 0 &&
                    <Grid item xs={12} sm={12} md={12} lg={12} className={classes.stepContent}>
                      <ImportData onRawDataHandler={onRawDataHandler}></ImportData>
                    </Grid>
                    }
                    {index === 1 &&
                    <Grid item xs={12} sm={12} md={12} lg={12} className={classes.stepContent}>
                      <SamplingPicker sensorsObj={sensorsObj} raw={raw} timestampsIndex={timestampsIndex} onSamplingData={onSamplingData}></SamplingPicker>
                    </Grid>
                    }
                    {index === 2  && raw &&
                    <Grid item xs={12} sm={12} md={12} lg={12} className={classes.stepContent}>
                      <IndicationSensor sensors={sensorsObj} indexCluster={false} onFilterByIndicator={onFilterByIndicator}></IndicationSensor>
                    </Grid>
                    }
                    {index === 3 && filteredSensors &&
                    <>
                    <Grid item container xs={12} sm={12} md={12} lg={12} direction="row" justifyContent="space-between" spacing={0}>
                      <Grid item xs={12} sm={12} md={12} lg={12} className={classes.stepContent}>
                        <DatePicker startSeries={raw['TimeStamp'][0]} endSeries={raw['TimeStamp'][raw['TimeStamp']?.length-2]} onPickedDate={onPickedDate} ></DatePicker>
                        <SensorPicker sensors={sensorsObj} checkedSensors={checkedSensors} raw={raw} timestampsIndex={timestampsIndex}  onPickedSensors={onPickedSensors} onUpDateSensors={onUpDateSensors}></SensorPicker>
                      </Grid>
                      <Grid item xs={12} sm={12} md={12} lg={12} style={{paddingTop: 10}}>
                      <Accordion square={false} className={classes.accordion}>
                        <AccordionSummary className={classes.accordionSummary} expandIcon={<AddCircleIcon className={classes.accordionIcon} />}>
                          Add special sensor
                        </AccordionSummary>
                        <AccordionDetails className={classes.accordionDetail}>
                          <AddFeatureSensor sensorsObj={sensorsObj.filter(sensor=>sensor.status !== "unavailable")} onAddFeatureSensor={onAddFeatureSensor} ></AddFeatureSensor>
                        </AccordionDetails>
                      </Accordion>
                      </Grid>
                    </Grid>
                    </>
                    }

                    {/* <Box sx={{ mb: 2 }}> */}
                      <Grid item container xs={12} sm={12} md={12} lg={12} direction="row" justifyContent="flex-end">
                        <Grid item xs={12} sm={4} md={4} lg={4}>
                          <Button
                            variant="contained"
                            onClick={handleNext}
                            sx={{ mt: 1, mr: 1 }}
                            className={classes.continueButton}
                          >
                            {index === steps.length - 1 ? 'Finish' : 'Continue'}
                          </Button>
                        </Grid>
                        <Grid item xs={12} sm={4} md={4} lg={4}>
                          <Button
                            disabled={index === 0}
                            onClick={handleBack}
                            sx={{ mt: 1, mr: 1 }}
                            className={classes.backButton}
                          >
                          Back
                        </Button>
                        </Grid>
                      </Grid>
                    {/* </Box> */}
                  </StepContent>
                </Step>
              ))}
            </Stepper>

            {activeStep === steps.length && (
              <Paper square elevation={0} sx={{ p: 3 }}>
                <Typography>All steps completed - you&apos;re finished</Typography>
                <Button onClick={handleReset} sx={{ mt: 1, mr: 1 }}>
                  Reset
                </Button>
              </Paper>
            )}
          </Box>

          {series && plotType === "scatter" &&      
          <Grid item xs={12} sm={12} md={12} lg={12} style={{padding: 10}}>
            <Grid item container xs={12} sm={12} md={12} lg={12} className={classes.stepContent} >
              <Grid item xs={12} sm={12} md={12} lg={12} style={{padding: 10}}>
                <ClustersTable clusters={clusters} onChange={clustersChangeHandler} activeClusterIndex={activeClusterIndex} onActiveChange={activeClusterChangeHandler} dataClusterIndex={dataClusterIndex} />
              </Grid>
              <Grid item xs={12} sm={12} md={12} lg={12} style={{padding: 10}}>
                <IndicationSensor sensors={checkedSensors} filteredTimestamps={filteredTimestamps} series={series} onBrushActivate={brushActivateHandler} onIndicationSensor={onSelected} indexCluster={true}></IndicationSensor>
              </Grid>
            </Grid>
          </Grid>
          }
          <Grid item xs={12} sm={12} md={12} lg={12} style={{padding: 10}}>
            <PlotTypePicker onSelectedType={onSelectedType}></PlotTypePicker>
          </Grid>
        </Grid>
      {/* </div> */}
      </Grid>

      <Grid item xs={9} sm={9} md={9} lg={9} className={classes.blackBackground}>
        {series &&
        <>
        {plotType === "scatter" &&
        <PairPlot style={{maxWidth: '80vw', height: '100vh'}} timestamps={filteredTimestamps} series={series} clusters={clusters} dataClusterIndex={dataClusterIndex} onBrushActivate={brushActivateHandler} onBrushDeactivate={brushDeactivateHandler} onSelected={onSelected} />
        }
        {plotType === "line" &&
        <LinePlot style={{maxWidth: '80vw', height: '100vh'}} timestamps={filteredTimestamps} series={series} startDate={startDate} endDate={endDate} sensors={checkedSensors} clusters={clusters} dataClusterIndex={dataClusterIndex}></LinePlot>
        }
        {/* {plotType === "kde" &&
          <div style={{
          // display: 'flex',
          width: '100vw',
          height: '100vh',
          flexDirection: 'row'
          }}>
            <KDEPlot style={{flexGrow: 1}} tags={checkedSensors} gridSize={64} data={kdeData} ></KDEPlot>
          </div>
        } */}
        </>
        }
      </Grid>
    </Grid> 
    </div>
  );
}

export default App;
