import EChartsReact from "echarts-for-react"
import { useMemo } from "react"
const histogramBarCount = 40

const offset = 5
const gap = 3

export default function PairPlot({series, timeseriesAxis, clusters, dataClusterIndex, style, onBrushActivate = () => {}, onBrushDeactivate = () => {}, onSelected = () => {}}) {
  let clusterIndex = useMemo(() => {
    if (dataClusterIndex === undefined) {
      return Object.entries(series)[0][1].map(() => -1)
    }
    return dataClusterIndex
  }, [dataClusterIndex, series])
  let option = useMemo(() => {
    let index = 0
    let grid = []
    let xAxis = []
    let yAxis = []
    let seriesOption = []
    let seriesNames = Object.keys(series)
    const seriesCount = seriesNames.length
    let brushLink = []
    let categories = []
    for (let i = 0; i < clusters.length; i++) {
      categories.push(i)
    }
    let categoriesColor = clusters.map(({color}) => color)
    const gridWidth = (100 - offset - gap) / (seriesCount + 1) - gap
    const gridHeight = (100 - offset - gap) / seriesCount - gap
    function buildGrid(id, i, j) {
      return {
        id: id,
        left: `${offset + j * (gridWidth + gap)}%`,
        top: `${offset + i * (gridHeight + gap)}%`,
        width: `${gridWidth}%`,
        height: `${gridHeight}%`,
        // containLabel: true,
        show: true
      }
    }
    function buildXAxis(name, show) {
      return {
        name,
        scale: true,
        type: 'value',
        position: 'top',
        gridIndex: index,
        axisLabel: {
          show
        },
        nameLocation: 'center'
      }
    }
    function buildYAxis(name, type, show) {
      return {
        name,
        scale: true,
        type,
        position: 'right',
        gridIndex: index,
        axisLabel: {
          show,
          showMinLabel: true,
          showMaxLabel: true
        },
        nameLocation: 'center'
      }
    }
    function buildScatterSeries(xName, yName, xFormatter) {
      return {
        type: 'scatter',
        encode: {
          x: [xName],
          y: [yName]
        },
        xAxisIndex: index,
        yAxisIndex: index,
        color: '#5470c6',
        tooltip: {
          formatter: params => {
            return `${params.marker}: x=${xFormatter(params.dataIndex)}, y=${series[yName][params.dataIndex].toFixed(2)}`
          }
        }
      }
    }
    for (let i = 0; i < seriesCount; i++) {
      for (let j = 0; j < seriesCount; j++) {
        if (j < i) continue
        grid.push(buildGrid(`grid-${seriesNames[i]}-${seriesNames[j]}`, i, j))
        xAxis.push(buildXAxis(i === 0?seriesNames[j]:undefined, i !== j?false:true))
        yAxis.push(buildYAxis(undefined, i !== j?'value':'category', false))
        
        if (i !== j) {
          brushLink.push(index)
          seriesOption.push(buildScatterSeries(seriesNames[j], seriesNames[i], dataIndex => series[seriesNames[j]][dataIndex].toFixed(2)))
        } else {
          let [min, max] = [Number.MAX_SAFE_INTEGER, Number.MIN_SAFE_INTEGER]
          // Scan for min/max
          for (let k = 0; k < series[seriesNames[i]].length; k++) {
            if (series[seriesNames[i]][k] < min) {
              min = series[seriesNames[i]][k]
            } else if (series[seriesNames[i]][k] > max) {
              max = series[seriesNames[i]][k]
            }
          }
          let frequency = []
          let bandwidth = (max - min) / histogramBarCount
          // build frequency for histogram plot
          for (let k = 0; k < series[seriesNames[i]].length; k++) {
            let index = Math.floor((series[seriesNames[i]][k] - min) / bandwidth)
            if (frequency[index] === undefined) {
              frequency[index] = [1, index * bandwidth + min, -1]
            } else {
              frequency[index][0]++
            }
          }
          seriesOption.push({
            type: 'bar',
            color: '#5470c6',
            data: frequency,
            xAxisIndex: index,
            yAxisIndex: index,
            tooltip: {
              formatter: params => {
                return `${params.data[1].toFixed(2)}: ${params.data[0].toFixed(0)} points`
              }
            }
          })
          xAxis[index].show = true
          yAxis[index].show = true
        }
        index++
      }
    }
    for (let i = 0; i < seriesCount; i++) {
      grid.push(buildGrid(`grid-${seriesNames[i]}-timeseries}`, i, seriesCount))
      xAxis.push(buildXAxis(i === 0?"timeseries":undefined, i === 0))
      yAxis.push(buildYAxis(seriesNames[i], 'value', true))
      brushLink.push(index)
      seriesOption.push(buildScatterSeries("timeseries", seriesNames[i], dataIndex => timeseriesAxis[dataIndex]))
      
      index++
    }
    return {
      dataset: {
        dimensions: [...Object.keys(series), "timeseries", "clusterIndex"],
        source: {
          ...series,
          timeseries: timeseriesAxis,
          clusterIndex
        },
      },
      grid,
      xAxis,
      yAxis,
      series: seriesOption,
      brush: {
        brushLink,
        xAxisIndex: brushLink,
        yAxisIndex: brushLink,
        toolbox: ['rect', 'polygon', 'keep', 'clear']
      },
      toolbox: {
        show: true,
      },
      tooltip: {},
      visualMap: [{
        type: 'piecewise',
        right: '10%',
        orient: 'horizontal',
        categories,
        inRange: {
          color: categoriesColor
        },
        outOfRange: {
          color: '#5470c6'
        },
        showLabel: false
      }]
    }
  }, [clusterIndex, clusters, series, timeseriesAxis])
  const eventsHandler = useMemo(() => ({
    'brushselected': (params) => {
      let {batch} = params
      if (batch?.length > 0) {
        let selectedIndex = batch[0].selected.find(({dataIndex}) => dataIndex.length > 0)
        if (selectedIndex !== undefined) {
          onSelected(selectedIndex.dataIndex)
        } else {
          onSelected([])
        }
      }
    },
    'globalcursortaken': params => {
      if (typeof params?.brushOption?.brushType === "boolean") {
        onBrushDeactivate()
      } else if (typeof params?.brushOption?.brushType === "string") {
        onBrushActivate()
      }
    }
  }), [onBrushActivate, onBrushDeactivate, onSelected])
  return <EChartsReact style={style} option={option} onEvents={eventsHandler} />
}