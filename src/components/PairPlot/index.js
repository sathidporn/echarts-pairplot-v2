// import EChartsReact from "echarts-for-react"
import { EchartsComponent } from "echarts-react-wrapper"
import { useCallback, useEffect, useMemo,  useState } from "react"
import { Grid } from "@mui/material"
import { style } from "../../styles/style"
import debounce from 'lodash.debounce'

const useStyles = style
const histogramBarCount = 40

const offset = 5
const gap = 3

export default function PairPlot({series, timestamps, clusters, dataClusterIndex, brushingMode, style, onBrushActivate = () => {}, onBrushDeactivate = () => {}, onSelected = () => {}}) {
  const classes = useStyles();
  // let chartRef = useRef()

  let clusterIndex = useMemo(() => {
    if (dataClusterIndex === undefined) {
      return Object.entries(series)[0][1].map(() => -1)
    }
    return dataClusterIndex
  }, [dataClusterIndex, series])

  const [xAxisActive, setXAxisActive] = useState()
  const [yAxisActive, setYAxisActive] = useState()

  let option = useMemo(() => {

    // console.log("option",clusterIndex, clusters, series, timestamps, xAxisActive, yAxisActive)
    let index = 0
    let grid = []
    let xAxis = []
    let yAxis = []
    let seriesOption = []
    let seriesNames = Object.keys(series)
    const seriesCount = seriesNames.length
    // console.log("test",series)
    let brushLink = []
    let categories = []
    for (let i = 0; i < clusters.length; i++) {
      categories.push(i)
      // categories.push(clusters[i].id)
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
    function buildXAxis(name, show, type='value') {
      return {
        id: name,
        name,
        nameTextStyle: {
          color: "#5470c6",
          fontWeight: xAxisActive === name ? 'bold' : 'normal',
          textBorderColor: xAxisActive === name ? "#ffffff" : 'transparent',
          textBorderWidth: xAxisActive === name ? 5 : 0,
          // backgroundColor: xAxisActive === name ? "#5470c6" : 'transparent',
          // borderRadius: 2,
          // height: 20,
          // width: 500,
          // verticalAlign: 'middle'
        },
        scale: true,
        type,
        position: 'top',
        gridIndex: index,
        axisLabel: {
          show: true,
          showMinLabel: true,
          showMaxLabel: true,
          color: xAxisActive === name ? "#5470c6" : "#ffffff",
        },
        axisLine: {
          show: true
        },
        axisTick: {
          show: true,
          inside: true
        },
        splitLine: {
          lineStyle: {
              color: 'white',
              opacity: 0
          }
        },
        nameLocation: 'center',
        nameGap: 30,
      }
    }
    function buildYAxis(name, type, show) {
      return {
        id: name,
        name,
        nameTextStyle: {
          color: "#5470c6",
          fontWeight: yAxisActive === name ? 'bold' : 'normal',
          textBorderColor: yAxisActive === name ? "#ffffff" : 'transparent',
          textBorderWidth: yAxisActive === name ? 5 : 0,
          // backgroundColor: xAxisActive === name ? "#5470c6" : 'transparent',
          // borderRadius: 2,
          // height: 20,
          // width: 500,
          // verticalAlign: 'middle'
        },
        scale: true,
        type,
        position: 'right',
        gridIndex: index,
        axisLabel: {
          show,
          showMinLabel: true,
          showMaxLabel: true,
          color: yAxisActive === name ? "#5470c6" : "#ffffff",
        },
        axisLine: {
          show
        },
        axisTick: {
          show,
          inside: true
        },
        splitLine: {
          lineStyle: {
              color: 'white',
              opacity: 0
          }
        },
        nameLocation: 'center',
        nameGap: 30,
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
          backgroundColor: '#242f39',
          // trigger: 'axis',
          textStyle:{
              color: '#ffffff',
              fontFamily: 'Roboto' ,
              fontSize: 15,
              width: 20
          },
          formatter: params => {
            // ${params.marker}
            return `<p style={{align: "left"}}>[ X ] ${xName} : ${xFormatter(params.dataIndex)}</p> <p style={{align: "left"}}>[ Y ] ${yName} : ${series[yName][params.dataIndex].toFixed(2)}</p>`
          }
        },
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
              backgroundColor: '#242f39',
              textStyle:{
                  color: '#ffffff',
                  fontFamily: 'Roboto' ,
                  fontSize: 15
              },
              formatter: params => {
                return `${params.data[1].toFixed(2)}: ${params.data[0].toFixed(0)} points`
              }
            },
          })
          xAxis[index].show = true
          yAxis[index].show = true
        }
        index++
      }
    }
    for (let i = 0; i < seriesCount; i++) {
      grid.push(buildGrid(`grid-${seriesNames[i]}-timeseries}`, i, seriesCount))
      xAxis.push(buildXAxis(i === 0?"timeseries":undefined, i === 0, "time"))
      yAxis.push(buildYAxis(seriesNames[i], 'value', true))
      brushLink.push(index)
      seriesOption.push(buildScatterSeries("timeseries", seriesNames[i], dataIndex => timestamps[dataIndex]))
      
      index++
    }
    return {
      dataset: {
        dimensions: [...Object.keys(series), "timeseries", "clusterIndex"],
        source: {
          ...series,
          timeseries: timestamps,
          clusterIndex
        },
      },
      legend: {
        show: true,
        icon: 'circle'
      },
      grid,
      xAxis,
      yAxis,
      series: seriesOption,
      brush: {
        brushLink,
        xAxisIndex: brushLink,
        yAxisIndex: brushLink,
        toolbox: ['rect', 'polygon', 'keep', 'clear'],    
        throttleType: 'debounce',   
        throttleDelay: 100
      },
      toolbox: {
        show: true,
      },
      tooltip: {},
      animation: false,
      visualMap: [{
        type: 'piecewise',
        right: '10%',
        orient: 'horizontal',
        categories,
        showLabel: true,
        itemSymbol: 'circle',
        textStyle: {
          color: "#ffffff"
        },
        inRange: {
          color: categoriesColor
        },
        outOfRange: {
          color: '#5470c6'
        },
      }]
    }
  }, [clusterIndex, clusters, series, timestamps, xAxisActive, yAxisActive])

  const [echarts, setEcharts] = useState()

  // let [brushActive, setBrushActive] = useState(false)

  // const onAxisActive = useCallback((params) => {
  //   if(params !== undefined){
  //     if(params.dimensionNames[params.encode.x] !== xAxisActive){
  //       setXAxisActive(params.dimensionNames[params.encode.x])
  //     }
  //     if(params.dimensionNames[params.encode.y] !== yAxisActive){
  //       setYAxisActive(params.dimensionNames[params.encode.y])
  //     }
  //   }else{
  //     setXAxisActive()
  //     setYAxisActive()
  //   }
  // },[setYAxisActive, setXAxisActive, xAxisActive, yAxisActive])
  // if (echarts !== undefined) {
  //   // perform some complex logic to generate option
  //   echarts.setOption(option, {notMerge: true})
  // }

  useEffect(() => {
    if(echarts !== undefined){
      if(brushingMode === true){
        console.log("setOption/brush=true")
        echarts.setOption(option, {
          // notMerge: false,
          replaceMerge: ['grid', 'yAxis', 'xAxis']
        })
      }else{
        console.log("setOption/brush=false")
        echarts.setOption(option, {
          notMerge: true,
        })
      }
    }
  }, [brushingMode, echarts, option])



  // if(echarts !== undefined){
  //   console.log("setOption")
  //     echarts.setOption(option, {
  //       // notMerge: false,
  //       replaceMerge: ['xAxis', 'yAxis', 'grid']
  //     })
  // }

  let updateEcharts = useCallback((instance) => {
    setEcharts(instance)
  },[setEcharts])
 
  let updateMousemove = useMemo(() => debounce((params) => {
    console.log("updateMousemove")
    if(params.encode !== undefined){
      // echarts.setOption(option, 
      //   {
      //     notMerge: true,
      //     // replaceMerge: []
      //   }
      // )
      // if(params.dimensionNames[params.encode.x] !== xAxisActive){
        setXAxisActive(params.dimensionNames[params.encode.x])
      // }
      // if(params.dimensionNames[params.encode.y] !== yAxisActive){
        setYAxisActive(params.dimensionNames[params.encode.y])
      // }
    }
  }, 100), [setYAxisActive, setXAxisActive]) 

  let updateBrushSelected = useMemo(() => debounce((params) => {
    console.log("updateBrushSelected")
    let {batch} = params
    if (batch?.length > 0) {
      let selectedIndex = batch[0].selected.find(({dataIndex}) => dataIndex.length > 0)
      if (selectedIndex !== undefined) {
        // echarts.setOption(option,
        //   {
        //     // notMerge: false,
        //     replaceMerge: ['xAxis', 'yAxis', 'grid']
        // })
        onSelected(selectedIndex.dataIndex)
      } else {
        onSelected([])
      }
    }
  }, 100), [onSelected])

  let updateGlobalCursorTaken = useMemo(() => debounce((params) => {
    console.log("updateGlobalCursorTaken")
    if (typeof params?.brushOption?.brushType === "boolean") {
      onBrushDeactivate()
      // echarts.setOption(option, {
      //   notMerge: true,
      //   // replaceMerge: ['grid', 'yAxis', 'xAxis']
      // })
    } else if (typeof params?.brushOption?.brushType === "string") {
      onBrushActivate()
      // echarts.setOption(option, {
      //   notMerge: false,
      //   // replaceMerge: ['grid', 'yAxis', 'xAxis']
      // })
    }
  }, 100), [onBrushActivate, onBrushDeactivate])


  // const eventHandlers = useCallback(() => ({
  //   mouseMove: (params, context) => {
  //     updateMousemove(params)
  //   },
  //   brushSelected: (params, context) => {
  //     updateBrushSelected(params)
  //   },
  //   globalCursorTaken:(params, context) => {
  //     updateGlobalCursorTaken(params)
  //   },
  // }),[updateMousemove, updateBrushSelected, updateGlobalCursorTaken])

  const eventHandler = useMemo(() => ({
    // mouseMove: updateMousemove,
    brushSelected: updateBrushSelected,
    globalCursorTaken:  updateGlobalCursorTaken
  }), [updateBrushSelected, updateGlobalCursorTaken])


  return (
    <>
    <Grid item xs={12} sm={12} md={12} lg={12} className={classes.blackBackground}>
      <EchartsComponent
        // ref={e => chartRef.current = e} 
        onInit={(instance) => updateEcharts(instance)}
        style={style} 
        // notMerge={true}
        // replaceMerge={["yAxis", "xAxis", "grid"]}
        // notMerge={true}
        // onEvents={eventsHandler} 
        // onEvents={{
        //   'mousemove':  updateMousemove,
        //   'brushselected': updateBrushSelected,
        //   'globalcursortaken': updateGlobalcursortaken
        // }}
        // eventHandlers={eventHandler}
        eventsHandler={eventHandler}
      />
    </Grid>
    
    </>
  )

}