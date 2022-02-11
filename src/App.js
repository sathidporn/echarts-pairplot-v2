import './App.css';
import {useCallback, useMemo, useReducer, useState} from 'react'

import { generateRandomSeries, generateSequence } from './utils/data_generator';
import PairPlot from './components/PairPlot';
import ClustersTable from './components/ClustersTable';

const seriesConfigs = {
  "seriesA": {n: 256},
  "seriesB": {n: 256, min: 10, max: 15},
  "seriesC": {n: 256, min: 95, max: 105},
  "seriesD": {n: 256, min: 1000, max: 1001},
}
const defaultCluster = {
  id: "default",
  color: "#00ff00"
}
function App() {
  let series = useMemo(() => {
    let temp = {}
    for (let [key, value] of Object.entries(seriesConfigs)) {
      temp[key] = generateRandomSeries(value)
    }
    return temp
  }, [])
  let timeseries = useMemo(() => {
    return generateSequence({n: 256})
  }, [])
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
    Object.values(series)[0].map(() => -1)
  )
  const brushActivateHandler = useCallback(() => {
    setBrushingMode(true)
  }, [setBrushingMode])
  const brushDeactivateHandler = useCallback(() => {
    setBrushingMode(false)
  }, [setBrushingMode])
  const onSelected = useCallback(index => {
    updateDataClusterIndex(index)
  }, [updateDataClusterIndex])
  return (
    <div className="App">
      <PairPlot style={{width: '100vw', height: '100vh'}} series={series} timeseriesAxis={timeseries} clusters={clusters} dataClusterIndex={dataClusterIndex} onBrushActivate={brushActivateHandler} onBrushDeactivate={brushDeactivateHandler} onSelected={onSelected} />
      <ClustersTable clusters={clusters} onChange={clustersChangeHandler} activeClusterIndex={activeClusterIndex} onActiveChange={activeClusterChangeHandler} dataClusterIndex={dataClusterIndex} />
    </div>
  );
}

export default App;
