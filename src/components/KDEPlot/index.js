import ReactECharts from 'echarts-for-react'
import 'echarts-gl'
import {useMemo} from 'react'
import * as tf from '@tensorflow/tfjs'
import {guassian_kde} from 'naive_kde'
let gl = document.createElement('canvas').getContext('webgl')
const MAX_TENSOR_SIZE = Math.pow(gl.getParameter(gl.MAX_TEXTURE_SIZE), 2)
gl = undefined // Return canvas and webgl to garbage collector.
console.info("Possible max tensor size is", MAX_TENSOR_SIZE)

export function KDEPlot({batchSize, data, gridSize=25, bins, style, tags}) {
  console.log("data",data)
  if (bins === undefined) {
    bins = gridSize * 2
  }
  let [axes, density] = useMemo(() => {
    let [n, dim] = data.shape
    if (dim > 0) {
      let batch = batchSize !== undefined?batchSize:Math.min(Math.floor(MAX_TENSOR_SIZE / (Math.pow(gridSize, dim) * dim)), n)
      console.info("Calculate grid of", gridSize, "over", dim, "dimensions with batch of", batch)
      let [axes, density] = guassian_kde({data, batchSize: batch, grids: gridSize, bins, boundaryExpansionFactor: 0.1, returnAxes: true})
      let max = tf.max(density).arraySync()
      return [axes, max !== 0?density.div(max):density]
    } else return [tf.tensor([]), tf.tensor([])]
  }, [batchSize, bins, data, gridSize])
  let series
  let grid
  let grid3D
  let xAxis
  let yAxis
  let xAxis3D
  let yAxis3D
  let zAxis3D
  let tooltip
  let visualMap
  let seriesData = []
  let min = Number.MAX_SAFE_INTEGER
  let max = Number.MIN_SAFE_INTEGER
  let xTicks
  let yTicks
  let zTicks
  // let source = []
  switch (data.shape[1]) {
    case undefined:
    case 0:
      return <></>
    case 1:
      seriesData = density.arraySync()
      series = [{
        type: 'line',
        smooth: true,
        data: seriesData
      }]
      grid = {
        show: true
      }
      grid3D = undefined
      xAxis3D = undefined
      yAxis3D = undefined
      zAxis3D = undefined
      xAxis = {
        type: 'category',
        data: axes[0].arraySync().map(tick => tick.toFixed(4))
      }
      yAxis = {
        type: 'value',
      }
      tooltip = {
        formatter(params) {
          return params.marker + params.data
        }
      }
      visualMap = [{
        id: 'filter',
        show: false,
        color: ['#5470C6']
      }]
      break
    case 2:
      seriesData = []
      xTicks = axes[0].arraySync()
      yTicks = axes[1].arraySync()
      density.arraySync().forEach((x, xi) => {
        x.forEach((density, yi) => {
          if (density !== 0) {
            seriesData.push([xTicks[xi], yTicks[yi], density])
            if (density < min) min = density
            else if (density > max) max = density
          }
        })
      })
      series = [{
        type: 'scatter',
        data: seriesData
      }]
      grid = {
      }
      grid3D = undefined
      xAxis3D = undefined
      yAxis3D = undefined
      zAxis3D = undefined
      xAxis = {
        type: 'value',
        // data: xTicks
      }
      yAxis = {
        type: 'value',
        // data: yTicks
      }
      tooltip = {
        formatter(params) {
          // console.log(params)
          return "<p style='text-align: left'><strong>" + tags[0] + ":</strong>" + params.data[0].toFixed(4) + 
            "<br/><strong>" + tags[1] + ":</strong>" + params.data[1].toFixed(4) + 
            "<br/><strong>Density :</strong>" + params.data[2].toFixed(3) + "</p>"
        }
      }
      visualMap = [{
        id: 'filter',
        type: 'continuous',
        min,
        max,
        calculable: true,
        color: ['#dd0000', '#cdcd00', '#99ee00'],
        show: true,
        precision: 4
      }]
      break
    default:
      seriesData = []
      xTicks = axes[0].arraySync()
      yTicks = axes[1].arraySync()
      zTicks = axes[2].arraySync()
      density.arraySync().forEach((x, xi) => {
        x.forEach((y, yi) => {
          y.forEach((density, zi) => {
            if (density !== 0) {
              seriesData.push([xTicks[xi], yTicks[yi], zTicks[zi], density])
              if (density < min) min = density
              else if (density > max) max = density
            }
          })
        })
      })
      series = [{
        type: 'scatter3D',
        data: seriesData
      }]
      grid = undefined
      xAxis = undefined
      yAxis = undefined
      grid3D = {
      }
      xAxis3D = {
        type: 'value',
        data: axes[0].arraySync()
      }
      yAxis3D = {
        type: 'value', 
        data: axes[1].arraySync()
      }
      zAxis3D = {
        type: 'value',
        data: axes[2].arraySync()
      }
      tooltip = {
        formatter(params) {
          // console.log(params)
          return "<p style='text-align: left'><strong>" + tags[0] + ":</strong>" + params.data[0].toFixed(4) + 
            "<br/><strong>" + tags[1] + ":</strong>" + params.data[1].toFixed(4) + 
            "<br/><strong>" + tags[2] + ":</strong>" + params.data[2].toFixed(4) + 
            "<br/><strong>Density :</strong>" + params.data[3].toFixed(3) + "</p>"
        }
      }
      visualMap = [{
        id: 'filter',
        type: 'continuous',
        min,
        max,
        calculable: true,
        color: ['#dd0000', '#cdcd00', '#99ee00'],
        show: true,
        precision: 4
      }]
  }
  const option = {
    // dataset: {
    //   source
    // },
    grid,
    grid3D,
    xAxis,
    yAxis,
    xAxis3D,
    yAxis3D,
    zAxis3D,
    series,
    tooltip,
    visualMap
  }
  return <ReactECharts style={{...style}} option={option} notMerge={true} />
}