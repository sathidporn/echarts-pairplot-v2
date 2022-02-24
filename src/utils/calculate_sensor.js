export function generateSpecialSensor({raw, newSensor}){
    // start -> add 
    if(newSensor.calType === "add"){
      if(newSensor.processType === "sensor"){
        let avg = []
        for(let i=0; i<newSensor.sensor.length; i++){
          if(i===0){
            avg = raw[newSensor.sensor[i]].map(function (num, idx) {
              return num + raw[newSensor.sensor[i+1]][idx]
            })
          }else if(i>1) {
            avg = avg.map(function (num, idx) {
              return num + raw[newSensor.sensor[i]][idx]
            })
          }
        }
        return avg
      }else if(newSensor.processType === "constant"){
        let avg = raw[newSensor.sensor[0]].map(function (num, idx) {
          return num + newSensor.constant
        })
        return avg
      }

    // start -> abs diff 
    }else if(newSensor.calType === "diff"){
      if(newSensor.processType === "sensor"){
        let diff = raw[newSensor.sensor[0]].map(function (num, idx) {
          return Math.abs(num - raw[newSensor.sensor[1]][idx])
        })
        return diff
      }else if(newSensor.processType === "constant"){
        let diff = raw[newSensor.sensor[0]].map(function (num, idx) {
          return Math.abs(num - newSensor.constant)
        })
        return diff
      }
      
    // start -> multiply 
    }else if(newSensor.calType === "multiply"){
      if(newSensor.processType === "sensor"){
        let mul = raw[newSensor.sensor[0]].map(function (num, idx) {
          return num * raw[newSensor.sensor[1]][idx];
        })
        return mul
      }else if(newSensor.processType === "constant"){
        let mul = raw[newSensor.sensor[0]].map(function (num, idx) {
          return num * newSensor.constant
        })
        return mul
      }

    // start -> divide 
    }else if(newSensor.calType === "divide"){
      if(newSensor.processType === "sensor"){
        let div = raw[newSensor.sensor[0]].map(function (num, idx) {
          return num /raw[newSensor.sensor[1]][idx]
        })
        return div
      }else if(newSensor.processType === "constant"){
        let div =  raw[newSensor.sensor[0]].map(function (num, idx) {
          return num / newSensor.constant
        })
        return div
      }

    // start -> average
    }else if(newSensor.calType === "average"){
      let avg = []
      for(let i=0; i<newSensor.sensor.length; i++){
        if(i===0){
          avg = raw[newSensor.sensor[i]].map(function (num, idx) {
            return num + raw[newSensor.sensor[i+1]][idx]
          })
        }else if(i>1) {
          avg = avg.map(function (num, idx) {
            return num + raw[newSensor.sensor[i]][idx]
          })
        }
      }
      avg = avg.map(function (num, idx) {
        return num / newSensor.sensor.length
      })
      return avg
    }else{
      console.error("generateSpecialSensor: calType is not define")
      return []
    }
}

export function maximumSensorSelection({calType, processType}){
  let maxSensors
  if(calType === "add" && processType === "sensor"){
      maxSensors = 10
  }else if(calType === "add" && processType === "constant"){
      maxSensors = 1
  }else if(calType === 'diff' && processType === "sensor"){
      maxSensors = 2
  }else if(calType === 'diff' && processType === "constant"){
      maxSensors = 1
  }else if(calType === 'multiply' && processType === "sensor"){
      maxSensors = 2
  }else if(calType === 'multiply' && processType === "constant"){
      maxSensors = 1
  }else if(calType === 'divide' && processType === "sensor"){
      maxSensors = 2
  }else if(calType === 'divide' && processType === "constant"){
      maxSensors = 1
  }else if(calType === 'average' && processType === "sensor"){
      maxSensors = 10
  }else {
    console.error("maximumSensorSelection: calType is not define")
  }
  return maxSensors
}

export function generateSensorName({sensorList, calType}){
  let shortCal
  if(calType === "add"){
      shortCal = "ADD"
  }else if(calType === "diff"){
      shortCal = "ABSDIFF"
  }else if(calType === "multiply"){
      shortCal = "MUL"
  }else if(calType === "divide"){
      shortCal ="DIV"
  }else if(calType === "average"){
      shortCal ="AVG"
  }else{
    console.error("generateSensorName: calType is not define")
  }

  let name = shortCal
  if(sensorList.length > 0){
      for(let i=0; i<sensorList?.length; i++){
          name = name + `_${sensorList[i]}`
      }
  }
  return name

}