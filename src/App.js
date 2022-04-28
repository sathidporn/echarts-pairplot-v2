import './App.css';
import * as React from 'react';
import {useCallback, useReducer, useState } from 'react'
import { Accordion, AccordionDetails, AccordionSummary, Grid } from '@mui/material';
import Box from '@mui/material/Box';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import StepContent from '@mui/material/StepContent';
import Button from '@mui/material/Button';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
// import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import AddCircleIcon from '@mui/icons-material/AddCircle';

import PairPlot from './components/PairPlot';
import LinePlot from './components/LinePlot'
import ClustersTable from './components/ClustersTable';
import IndicationSensor from './components/IndicationSensor';
import SensorPicker from './components/SensorPicker'
import DatePicker from './components/DatePicker';
import PlotTypePicker from './components/PlotTypePicker';
import ImportData from './components/ImportData';
// import ImportSensorList from './components/ImportSensorList';
import AddSpecialSensor from './components/AddSpecialSensor';
import SamplingPicker from './components/SamplingPicker';
import DialogMessage from './components/DialogMessage';
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
    label: 'Upload data',
    description: `Raw data file should be .csv format and this file must cleaned data such as bad text, null value, etc... `,
  },
  {
    label: 'Sampling type',
    description:
      'When selected sampling it will sampling raw data to 1 hour rate',
  },
  {
    label: 'Filter data',
    description: `User can filtering data use indicator sensor`,
  },
  // {
  //   label: 'Import sensor file',
  //   description: ``,
  // },
  {
    label: 'Select sensor',
    description: `Select sensor and date to plot graph`,
  },
  // {
  //   label: 'Select date range',
  //   description: `Select sensor and date to plot graph`,
  // },
  {
    label: 'Customize Chart',
    description: `Select sensor and date to plot graph`,
  },
];

function App() {
  const classes = useStyles();
  const [activeStep, setActiveStep] = React.useState(0);

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
    if(activeStep === 2 && filteredSensors === undefined){
      setFilteredTimestamps(samplingTimestamp)
      setFilteredSensors(samplingData)
    }
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleReset = () => {
    setActiveStep(0);
  };
  
  // raw data from file
  let [raw, setRaw] = useState()
  // unique index by 1 hour sampling rate
  let [timestampsIndex, setTimestampsIndex] = useState()
  // raw data for kde plot
  // let [content, setContent] = useState([])

  // sampling all sensor data
  let [samplingData, setSamplingData] = useState()
  // sampling all timestamps data
  let [samplingTimestamp, setSamplingTimestamp] = useState()
  // filtered all sensor data
  let [filteredSensors, setFilteredSensors] = useState()
  // filtered all timestamps data 
  let [filteredTimestamps, setFilteredTimestamps] = useState()

  // selected sensors to plot
  let [checkedSensors, setCheckedSensors] = useState([])
  // all sensor object
  let [sensors, setSensors] = useState([])
  // all special sensors
  let [specialSensors, setSpecialSensors] = useState([])
  // filtered data only selected sensors
  let [series, setSeries] = useState()

  let [open, setOpen] = useState(false)
  let [message, setMessage] = useState()
  let [startDate, setStartDate] = useState()
  let [endDate, setEndDate] = useState()
  let [filterProcess, setFilterProcess] = useState({tag: undefined, operator: undefined, firstValue: undefined, secondValue: undefined})

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
    // console.log("onSelected => ",index)
    updateDataClusterIndex(index)
  }, [updateDataClusterIndex])

  // start to filter series and timestamps by sensor and date

  let [plotType, setPlotType] = useState("scatter")
  const onSelectedType = useCallback((type) => {
    setPlotType(type)
  },[setPlotType])

  // Get raw data
  const onRawDataHandler = useCallback((columns, raw, data, timestampsIndex, timestamps) => {
    let sensorsArray = []
    let sensors = {}
    if(raw !== undefined){
      setRaw(raw)
      // setContent(data)
      setTimestampsIndex(timestampsIndex)
      setSamplingTimestamp(timestamps)
      // Make sensor object
      for (let sensor of columns) {
        if(sensor!== "TimeStamp"){
          sensors[sensor] = {tag: sensor, checked: false, name: "", description: "", type: "", unit: "", method: "", component: ""}
          sensorsArray.push(sensors[sensor])
        }
      }
      setSensors(sensorsArray)
      setSeries(undefined)
      setOpen(true)
      setMessage("Raw data has been uploaded successfully.")
      console.log("onRawDataHandler => ", raw)
    }else{
      setOpen(true)
      setMessage("Please try again to upload raw data.")
      console.error("onRawDataHandler => ", raw)
    }
  }, [setRaw, setTimestampsIndex, setSamplingTimestamp, setSensors, setSeries, setOpen, setMessage])

  // Generate special sensor data when import special sensor file
  const onGenerateSpecialSensor = useCallback((specialSensors) => {
    // let sensors = sensors.filter(sensor=>sensor.status === "unavailable")
    let updateFilteredSensors = filteredSensors
    let updateSensors = sensors.filter(sensor=>sensor.status === "unavailable")
    sensors.map((sensor) => {
      let filterSensor  = specialSensors.filter(s=>s.specialTag === sensor.tag)
      let derivedSensors = []
      filterSensor.map((sensor) => {
        derivedSensors.push({tag: sensor.derivedFromTag})
        return derivedSensors
      })
      let specialSensor = {sensor: derivedSensors, tag: sensor.tag, name: sensor.name, calType: filterSensor[0].calType, subType: filterSensor[0].subType, constant: filterSensor[0].factor}
      let specialSensorObj = {}
      let specialSensorData = generateSpecialSensor({filteredSensors: updateFilteredSensors, specialSensor})
      specialSensorObj[`${specialSensor.tag}`] = specialSensorData
      updateFilteredSensors = Object.assign(specialSensorObj, updateFilteredSensors)

      let index = sensors.findIndex(obj => obj.tag === sensor.tag)
      if (index !== -1 &&  updateFilteredSensors[sensor.tag].length > 0) {
        updateSensors = [...updateSensors.slice(0, index), { ...updateSensors[index], status: "available"}, ...updateSensors.slice(index + 1)]
      }
      return updateFilteredSensors
    })
    setFilteredSensors(updateFilteredSensors)
    setSensors(updateSensors)
    console.log("onGenerateSpecialSensor => ",updateFilteredSensors, updateSensors)
  },[filteredSensors, sensors, setFilteredSensors, setSensors])

  // Make raw data to sampling data by type
  const onSamplingData = useCallback((type) => {
    let updateSamplingData = {}
      // Loop for generate sampling data of each sensor
      sensors.map((sensor) => {
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

      if(updateSamplingData !== undefined) {
        setSamplingData(updateSamplingData)
        setOpen(true)
        setMessage("Data has been sampled successfully.") 
        console.log("onSamplingData => ",updateSamplingData)
      }else{
        setOpen(true)
        setMessage("Failed to sampling data.") 
        console.error("onSamplingData => ",updateSamplingData)

      }
     
      // Update filteredSensors, filteredTimestamps
      let updateTimestamps = cleansingTimestamps({ tag: filterProcess.tag, operator: filterProcess.operator, value1: filterProcess.firstValue, value2: filterProcess.secondValue, samplingData: updateSamplingData, samplingTimestamp})
      let updateSensors = cleansingSensors({ tag: filterProcess.tag, operator: filterProcess.operator, value1: filterProcess.firstValue, value2: filterProcess.secondValue, sensors, samplingData: updateSamplingData, samplingTimestamp})
      if(Object.keys(updateSensors).length > 0){
        setFilteredTimestamps(updateTimestamps)
        setFilteredSensors(updateSensors)
        // Update series when sampling data changed
        if(checkedSensors.length > 0){
          const updateSeries = Object.keys(updateSensors).filter(key => checkedSensors.includes(key)).reduce((obj, key) => {
            obj[key] = updateSensors[key]
            return obj
          }, {})
          if(Object.keys(updateSeries).length > 0){
            setSeries(updateSeries)
            updateDataClusterIndex(Object.values(updateSeries)[0].map(() => -1)) 
            setOpen(true)
            setMessage("Data has been updated successfully.")
            console.log("onSamplingData / update series => ", updateSeries)
          }
          else{
            setOpen(true)
            setMessage("Failed to update data.")
            console.error("onSamplingData / update series => ", updateSeries)
          }  
        }
      }
  },[checkedSensors, sensors, timestampsIndex, raw, filterProcess, samplingTimestamp, setSamplingData, setSeries, setOpen, setMessage])

  // Filter data by indicator sensor
  const onFilterByIndicator = useCallback((tag, operator, value1, value2) => {
    // Update filteredSensors, filteredTimestamps
    if(tag && operator){
      let updateTimestamps
      let updateSensors
      if(filteredSensors){
        updateTimestamps = cleansingTimestamps({tag, operator, value1, value2, values: filteredSensors, timestamps: filteredTimestamps})
        updateSensors = cleansingSensors({tag, operator, value1, value2, sensors, values: filteredSensors,  timestamps: filteredTimestamps})
        console.log("onFilterByIndicator/false => ",updateTimestamps,updateSensors)
      }else{
        updateTimestamps = cleansingTimestamps({tag, operator, value1, value2, values: samplingData, timestamps: samplingTimestamp})
        updateSensors = cleansingSensors({tag, operator, value1, value2, sensors, values: samplingData, timestamps: samplingTimestamp})
        console.log("onFilterByIndicator/false => ",samplingData, samplingTimestamp, updateTimestamps,updateSensors)
      }

      if(Object.keys(updateSensors).length > 0){
        setFilteredTimestamps(updateTimestamps)
        setFilteredSensors(updateSensors)
        setFilterProcess({tag: tag, operator: operator, firstValue: value1, secondValue: value2})
        setOpen(true)
        setMessage("Data has been filtered successfully.") 
        console.log("onFilterByIndicator => ",updateSensors)
        // Update series when filter process changed
        if(checkedSensors.length > 0){
          const updateSeries = Object.keys(updateSensors).filter(key => checkedSensors.includes(key)).reduce((obj, key) => {
            obj[key] = updateSensors[key]
            return obj
          }, {})
          if(Object.keys(updateSeries).length > 0){
            setSeries(updateSeries)
            updateDataClusterIndex(Object.values(updateSeries)[0].map(() => -1)) 
            setOpen(true)
            setMessage("Data has been updated successfull.")
            console.log("onFilterByIndicator / update series => ", updateSeries)
          }else{
            setOpen(true)
            setMessage("Failed to update data.")
            console.error("onFilterByIndicator / update series => ", updateSeries)
          }
        } 
      }else{
        setOpen(true)
        setMessage("No data in this condition.") 
        console.log("onFilterByIndicator => ",updateSensors)
      }
    }else{
      setOpen(true)
      setMessage("Please fill up this form.") 
    }
  }, [sensors, checkedSensors, samplingData, samplingTimestamp, filteredSensors, filteredTimestamps, setFilteredSensors, setFilteredTimestamps, setFilterProcess, setSeries])

  // Add sensor to plot
  const onPickedSensors = useCallback((tag, checkedSensors, newSensorsObj ) => {
    console.log("checked",checkedSensors)
    // Add new sensor series 
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

    // Update new series when pick sensor
    if(checkedSensors.length > 0){
      const updateSeries = Object.keys(addNewSeries).filter(key => checkedSensors.includes(key)).reduce((obj, key) => {
        obj[key] = addNewSeries[key]
        return obj
      }, {})
      if(Object.keys(updateSeries).length > 0){
        setSeries(updateSeries)
        updateDataClusterIndex(Object.values(updateSeries)[0].map(() => -1)) 
        setBrushingMode(false)
        console.log("onPickedSensors / update series => ", updateSeries)
      }else{
        console.error("onPickedSensors / update series => ", updateSeries)
      }
    }else{
      setSeries(undefined)
    }
    setCheckedSensors(checkedSensors)
    setSensors(newSensorsObj)
  },[filteredSensors, series, setSeries, updateDataClusterIndex, setCheckedSensors, setSensors, setBrushingMode])

  // Filter data when picked date
  const onPickedDate = useCallback((startDate, endDate) => {
    setStartDate(startDate)
    setEndDate(endDate)
    // Update timestamps by start date and end date
    let updateTimestamps = []
    if(filteredTimestamps){
      for (let i = 0; i < filteredTimestamps.length; i++) {
        if (filteredTimestamps[i] >= startDate && filteredTimestamps[i] <= endDate) {
          updateTimestamps.push(filteredTimestamps[i])
        }  
      }
    }else{
      for (let i = 0; i < samplingTimestamp.length; i++) {
        if (samplingTimestamp[i] >= startDate && samplingTimestamp[i] <= endDate) {
          updateTimestamps.push(samplingTimestamp[i])
        }  
      }
    }

    setFilteredTimestamps(updateTimestamps)
    // Update series by start date and end date
    if(checkedSensors.length > 0){
      let updateSeries = {}
      checkedSensors.map((sensor) => {
        let values = []
        for (let i = 0; i < filteredTimestamps.length; i++) {
          if (filteredTimestamps[i] >= startDate && filteredTimestamps[i] <= endDate) {
            values.push(series[sensor][i])
            updateSeries[sensor] = values
          }
        }
        return values 
      })
      if(Object.keys(updateSeries).length > 0){
        setSeries(updateSeries)
        updateDataClusterIndex(Object.values(updateSeries)[0].map(() => -1)) 
        console.log("onPickedDate / update series => ", updateSeries)
        setOpen(true)
        setMessage("Data has been filtered successfully.")
      }else{
        console.log("onPickedDate / update series => ", updateSeries)
        setOpen(true)
        setMessage("No data in this condition.")
      }
    }
  }, [checkedSensors, series, filteredTimestamps, samplingTimestamp, setSeries, setStartDate, setEndDate, updateDataClusterIndex])

  // Add new special sensor
  const onAddSpecialSensor = useCallback((specialSensor) => {
    if(specialSensor){
      let specialSensorObj = {}
      let specialSensorData = generateSpecialSensor({filteredSensors, specialSensor})
      specialSensorObj[`${specialSensor.tag}`] = specialSensorData
      if(specialSensorObj !== undefined){
        let updateFilteredSensors = Object.assign(specialSensorObj, filteredSensors)
        setFilteredSensors(updateFilteredSensors)
        setSensors([...sensors, {status: "new", tag: `${specialSensor.tag}`, checked: false, name: `${specialSensor.name}`, description: "", type: "", unit: "", method: `${specialSensor.calType}`, component: ""}])
        setOpen(true)
        setMessage("Special sensor has been added successfully.")
        console.log("onAddSpecialSensor => ", specialSensorObj)
      }else{
        setOpen(true)
        setMessage("Failed to add special sensor.")
        console.log("onAddSpecialSensor => ", specialSensorObj)
      }
    }else{
      setOpen(true)
      setMessage("Please fill up this form.")
    }
  },[filteredSensors, sensors, setFilteredSensors, setSensors])

  // Get sensor list file
  const onReadSensorListFile = useCallback((list) => {
    if(list !== undefined){
        let sensorList = list.filter(sensor=>sensor.SENSOR_TAG !== "").map((sensor) => {
          let index = sensors.findIndex(obj => obj.tag === sensor.SENSOR_TAG)
          if(index !== -1){
              return {
                  status: "available", 
                  tag: sensors[index].tag, 
                  checked: sensors[index].checked, 
                  name: sensor.SENSOR_NAME, 
                  description: sensor.SENSOR_DESCRIPTION, 
                  type: sensor.SENSOR_TYPE, 
                  unit: sensor.SENSOR_UNIT
              }
          }else{
              return{
                  status: "unavailable", 
                  tag: sensor.SENSOR_TAG, 
                  checked: false, 
                  name: sensor.SENSOR_NAME, 
                  description: sensor.SENSOR_DESCRIPTION, 
                  type: sensor.SENSOR_TYPE, 
                  unit: sensor.SENSOR_UNIT
              }
          }
        })
        setSensors(sensorList)
        // setOpen(true)
        // setMessage("Sensor list file has uploaded successful.")
        console.log("onReadSensorListFile => ",  sensorList)
    }else{
        // setOpen(true)
        // setMessage("Please try again to upload sensor list file.")
        console.error("onReadSensorListFile => ", list)
    }
  },[sensors, setSensors])

      // Get special sensor file
  const onReadSpecialSensorListFile = useCallback((list) => {
    if(list !== undefined){
      let specialList = list.filter(sensor=>sensor.SPECIAL_TAG !== "").map(sensor => {
        return {
            specialTag: sensor.SPECIAL_TAG,
            specialName: sensor.SPECIAL_NAME,
            derivedFromTag: sensor.DERIVED_FROM_TAG,
            derivedFromName: sensor.DERIVE_FROM_NAME,
            calType: sensor.CAL_TYPE,
            subType: sensor.SUB_TYPE,
            fromUnit: sensor.FROM_UNIT,
            toUnit: sensor.TO_UNIT, 
            factor: sensor.FACTOR,
        }
      })
      setSpecialSensors(specialList)
      // setOpen(true)
      // setMessage("Special sensor list has uploaded successful.")
      console.log("onReadSpecialSensorListFile => ", specialList)
    }else{
      // setOpen(true)
      // setMessage("Please try again to upload special sensor list file.")
      console.error("onReadSpecialSensorListFile => ", list)
    }
  },[setSpecialSensors])

  // Remove new special sensor
  const onRemoveSpecialSensor = useCallback((tag) => {
    let updateSensors = sensors.filter(sensor=> sensor.tag !== tag)
    let updateSpecialSensors = specialSensors.filter(sensor=> sensor.specialTag !== tag)
    setSensors(updateSensors)
    setSpecialSensors(updateSpecialSensors)
  }, [sensors, specialSensors, setSensors, setSpecialSensors])

  // Update sensor obj from components
  const onUpDateSensors = useCallback((updateSensors) => {
    console.log("update",updateSensors)
    setSensors(updateSensors)
  }, [setSensors])

  // Update special sensor from components
  const onUpdateSpecialSensors = useCallback((updateSpecialSensors) => {
    console.log("update",updateSpecialSensors)
    setSpecialSensors(updateSpecialSensors)
  }, [setSpecialSensors])

  // Close dialog
  const handleCloseDialog = useCallback(() => {
    setOpen(false)
  },[setOpen])


  // const kdeData = useMemo(() => {
  //   let selectedData = content.map(row => Object.entries(row).filter(([key]) => checkedSensors.indexOf(key) !== -1).map(([_, value]) => value))
  //   console.log("selected",selectedData)
  //   return tf.tensor(selectedData)
  // }, [checkedSensors, content])

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
                    {index === 1 && raw && 
                    <Grid item xs={12} sm={12} md={12} lg={12} className={classes.stepContent}>
                      <SamplingPicker sensors={sensors} raw={raw} timestampsIndex={timestampsIndex} onSamplingData={onSamplingData}></SamplingPicker>
                    </Grid>
                    }
                    {index === 2  && samplingData &&
                    <Grid item xs={12} sm={12} md={12} lg={12} className={classes.stepContent}>
                      <Grid item container xs={12} sm={12} md={12} lg={12} spacing={1}>
                        <Grid item xs={12} sm={12} md={12} lg={12} align="left">
                          <Typography className={classes.headerTextWhite}>Filter data by indication sensor</Typography>
                        </Grid>
                        <Grid item xs={12} sm={12} md={12} lg={12}>
                          <IndicationSensor sensors={sensors} indexCluster={false} onFilterByIndicator={onFilterByIndicator}></IndicationSensor> 
                        </Grid>
                      </Grid>
                      {/* <Grid item container xs={12} sm={12} md={12} lg={12} spacing={1}>
                        <Grid item xs={12} sm={12} md={12} lg={12} align="left">
                          <Typography className={classes.headerTextWhite}>By date</Typography>
                        </Grid>
                        <Grid item xs={12} sm={12} md={12} lg={12}>
                          <DatePicker startSeries={raw['TimeStamp'][0]} endSeries={raw['TimeStamp'][raw['TimeStamp']?.length-2]} onPickedDate={onPickedDate} ></DatePicker>
                        </Grid>
                      </Grid> */}
                    </Grid>
                    }
                    {/* {index === 3 && filteredSensors &&
                    <>
                    <Grid item xs={12} sm={12} md={12} lg={12} className={classes.stepContent}>
                      <ImportSensorList specialFile={false} onReadSensorListFile={onReadSensorListFile}></ImportSensorList>
                      <ImportSensorList specialFile={true} onReadSensorListFile={onReadSpecialSensorListFile}></ImportSensorList>
                    </Grid>
                    </>
                    } */}
                    {index === 3 && (samplingData || filteredSensors) &&
                    <>
                    <Grid item container xs={12} sm={12} md={12} lg={12} direction="row" justifyContent="space-between" spacing={1}>
                        {/* <ImportSensorList specialFile={false} onReadSensorListFile={onReadSensorListFile}></ImportSensorList>
                        <ImportSensorList specialFile={true} onReadSensorListFile={onReadSpecialSensorListFile}></ImportSensorList> */}
                      <Grid item xs={12} sm={12} md={12} lg={12} className={classes.stepContent}>
                        <Grid item container xs={12} sm={12} md={12} lg={12} spacing={1}>
                          <Grid item xs={12} sm={12} md={12} lg={12}>
                            <DatePicker startSeries={raw['TimeStamp'][0]} endSeries={raw['TimeStamp'][raw['TimeStamp']?.length-2]} onPickedDate={onPickedDate} ></DatePicker>
                          </Grid>
                          <Grid item xs={12} sm={12} md={12} lg={12}>
                            <SensorPicker sensors={sensors} checkedSensors={checkedSensors} raw={raw} timestampsIndex={timestampsIndex}  onPickedSensors={onPickedSensors} onCustomizeSensors={onUpDateSensors} onRemoveSpecialSensor={onRemoveSpecialSensor} onReadSensorListFile={onReadSensorListFile}></SensorPicker>
                          </Grid>
                        </Grid>
                      </Grid>
                      <Grid item xs={12} sm={12} md={12} lg={12}>
                        <AddSpecialSensor sensors={sensors.filter(sensor=>sensor.status !== "unavailable")} specialSensors={specialSensors} onAddSpecialSensor={onAddSpecialSensor} onGenerateSpecialSensor={onGenerateSpecialSensor} onCustomizeSensors={onUpdateSpecialSensors} onRemoveSpecialSensor={onRemoveSpecialSensor} onReadSpecialSensorListFile={onReadSpecialSensorListFile}></AddSpecialSensor>
                      </Grid>
                    </Grid>
                    </>
                    }
{/* 
                    {index === 4 && series &&
                      <Grid item xs={12} sm={12} md={12} lg={12}  className={classes.stepContent} >
                        <DatePicker startSeries={raw['TimeStamp'][0]} endSeries={raw['TimeStamp'][raw['TimeStamp']?.length-2]} onPickedDate={onPickedDate} ></DatePicker>
                      </Grid>
                    } */}

                    {index === 4 && series &&
                    <>
                      <PlotTypePicker onSelectedType={onSelectedType}></PlotTypePicker>
                      {plotType === "scatter" &&      
                      <Grid item xs={12} sm={12} md={12} lg={12}  className={classes.stepContent} >
                        <Grid item container xs={12} sm={12} md={12} lg={12}>
                          <Grid item xs={12} sm={12} md={12} lg={12}>
                            <ClustersTable clusters={clusters} onChange={clustersChangeHandler} activeClusterIndex={activeClusterIndex} onActiveChange={activeClusterChangeHandler} dataClusterIndex={dataClusterIndex} />
                          </Grid>
                          <Grid item xs={12} sm={12} md={12} lg={12}>
                            <IndicationSensor sensors={checkedSensors} filteredTimestamps={filteredTimestamps} series={series} onBrushActivate={brushActivateHandler} onBrushByIndicator={onSelected} indexCluster={true}></IndicationSensor>
                          </Grid>
                        </Grid>
                      </Grid>
                      }
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
                            {index === steps.length - 1 ? 'Reset' : 'Next Step'}
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
              <Paper square elevation={0} sx={{ p: 3 }} className={classes.background}>
                <Typography className={classes.contentTextWhite}>All steps completed</Typography>
                <Button onClick={handleReset} sx={{ mt: 1, mr: 1 }} className={classes.defaultButton}>
                  Reset All Step
                </Button>
              </Paper>
            )}
          </Box>
        </Grid>
      {/* </div> */}
      </Grid>

      <Grid item xs={9} sm={9} md={9} lg={9} className={classes.blackBackground}>
        {series !== undefined ? (
          <>
          {plotType === "scatter" &&
          <PairPlot style={{maxWidth: '80vw', height: '100vh'}} timestamps={filteredTimestamps} series={series} clusters={clusters} dataClusterIndex={dataClusterIndex} brushingMode={brushingMode} onBrushActivate={brushActivateHandler} onBrushDeactivate={brushDeactivateHandler} onSelected={onSelected}/>
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
          ):(
            <Grid item lg={12} alignSelf="center" alignContent="center" alignItems="center">
              <Typography style={{color: '#ffffff'}}>No data</Typography>
            </Grid>
          )
        }
      </Grid>
    </Grid>

    <DialogMessage message={message} open={open} handleCloseDialog={handleCloseDialog}></DialogMessage>
    </div>
  );
}

export default App;
