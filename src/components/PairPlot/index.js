import EChartsReact from "echarts-for-react"
import { useMemo } from "react"
const histogramBarCount = 40
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
    const offset = 5
    const gap = 3
    const gridWidth = (100 - offset - gap) / (seriesCount + 1) - gap
    const gridHeight = (100 - offset - gap) / seriesCount - gap
    for (let i = 0; i < seriesCount; i++) {
      for (let j = 0; j < seriesCount; j++) {
        if (j < i) continue
        grid.push({
          id: `grid-${seriesNames[i]}-${seriesNames[j]}`,
          left: `${offset + j * (gridWidth + gap)}%`,
          top: `${offset + i * (gridHeight + gap)}%`,
          width: `${gridWidth}%`,
          height: `${gridHeight}%`,
          // containLabel: true,
          show: true
        })
        xAxis.push({
          name: i === 0?seriesNames[j]:undefined,
          scale: true,
          type: 'value',
          position: 'top',
          gridIndex: index,
          axisLabel: {
            show: i !== j?false:true
          },
          nameLocation: 'center'
        })
        yAxis.push({
          // name: j === seriesCount - 1?seriesNames[i]:undefined,
          scale: true,
          type: i !== j?'value':'category',
          position: 'right',
          gridIndex: index,
          axisLabel: {
            show: false,
            showMinLabel: true,
            showMaxLabel: true
          },
          nameLocation: 'center'
        })
        if (i !== j) {
          brushLink.push(index)
          seriesOption.push({
            type: 'scatter',
            encode: {
              x: [seriesNames[j]],
              y: [seriesNames[i]]
            },
            xAxisIndex: index,
            yAxisIndex: index,
            color: '#5470c6',
            tooltip: {
              formatter: params => {
                return `${params.marker}: x=${series[seriesNames[j]][params.dataIndex].toFixed(2)}, y=${series[seriesNames[i]][params.dataIndex].toFixed(2)}`
              }
            }
          })
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
      grid.push({
        id: `grid-${seriesNames[i]}-timeseries}`,
        left: `${offset + seriesCount * (gridWidth + gap)}%`,
        top: `${offset + i * (gridHeight + gap)}%`,
        width: `${gridWidth}%`,
        height: `${gridHeight}%`,
        // containLabel: true,
        show: true
      })
      xAxis.push({
        name: i === 0?"timeseries":undefined,
        scale: true,
        type: 'value',
        position: 'top',
        gridIndex: index,
        axisLabel: {
          show: i === 0
        },
        nameLocation: 'center'
      })
      yAxis.push({
        name: seriesNames[i],
        scale: true,
        type: 'value',
        position: 'right',
        gridIndex: index,
        axisLabel: {
          show: true,
          showMinLabel: true,
          showMaxLabel: true
        },
        nameLocation: 'center'
      })
      brushLink.push(index)
      seriesOption.push({
        type: 'scatter',
        encode: {
          x: ["timeseries"],
          y: [seriesNames[i]]
        },
        xAxisIndex: index,
        yAxisIndex: index,
        color: '#5470c6',
        tooltip: {
          formatter: params => {
            return `${params.marker}: x=${timeseriesAxis[params.dataIndex]}, y=${series[seriesNames[i]][params.dataIndex].toFixed(2)}`
          }
        }
      })
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