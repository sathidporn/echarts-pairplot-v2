export function generateSpecialSensor({filteredSensors, featureSensor}){
    // start -> ADD / max 10 sensor 
    if(featureSensor.calType === "ADD"){
      if(featureSensor.processType === "sensor"){
        let avg = []
        for(let i=0; i<featureSensor.sensor.length; i++){
          if(i===0){
            avg = filteredSensors[featureSensor.sensor[i].tag].map(function (num, idx) {
              return num + filteredSensors[featureSensor.sensor[i+1].tag][idx]
            })
          }else if(i>1) {
            avg = avg.map(function (num, idx) {
              return num + filteredSensors[featureSensor.sensor[i].tag][idx]
            })
          }
        }
        return avg
      }else if(featureSensor.processType === "constant"){
        let avg = filteredSensors[featureSensor.sensor[0].tag].map(function (num, idx) {
          return num + featureSensor.constant
        })
        return avg
      }

    // start -> abs ABSDIFF  / max 2 sensor 
    }else if(featureSensor.calType === "ABSDIFF"){
      if(featureSensor.processType === "sensor"){
        let ABSDIFF = filteredSensors[featureSensor.sensor[0].tag].map(function (num, idx) {
          return Math.abs(num - filteredSensors[featureSensor.sensor[1].tag][idx])
        })
        return ABSDIFF
      }else if(featureSensor.processType === "constant"){
        let ABSDIFF = filteredSensors[featureSensor.sensor[0].tag].map(function (num, idx) {
          return Math.abs(num - featureSensor.constant)
        })
        return ABSDIFF
      }
      
    // start -> MUL / max 10 sensor
    }else if(featureSensor.calType === "MUL"){
      // if(featureSensor.processType === "sensor"){
      //   let mul = filteredSensors[featureSensor.sensor[0]].map(function (num, idx) {
      //     return num * filteredSensors[featureSensor.sensor[1]][idx];
      //   })
      //   return mul
      // }else if(featureSensor.processType === "constant"){
      //   let mul = filteredSensors[featureSensor.sensor[0]].map(function (num, idx) {
      //     return num * featureSensor.constant
      //   })
      //   return mul
      // }
      let mul = []
      for(let i=0; i<featureSensor.sensor.length; i++){
        if(i===0){
          mul = filteredSensors[featureSensor.sensor[i].tag].map(function (num, idx) {
            return num * filteredSensors[featureSensor.sensor[i+1].tag][idx]
          })
        }else if(i>1) {
          mul = mul.map(function (num, idx) {
            return num * filteredSensors[featureSensor.sensor[i].tag][idx]
          })
        }
      }
      if(featureSensor.processType === "constant"){
        mul = mul.map(function (num, idx) {
          return num * featureSensor.constant
        })
      }

    // start -> DIV / max 2 sensor
    }else if(featureSensor.calType === "DIV"){
      if(featureSensor.processType === "sensor"){
        let div = filteredSensors[featureSensor.sensor[0].tag].map(function (num, idx) {
          return num /filteredSensors[featureSensor.sensor[1].tag][idx]
        })
        return div
      }else if(featureSensor.processType === "constant"){
        let div =  filteredSensors[featureSensor.sensor[0].tag].map(function (num, idx) {
          return num / featureSensor.constant
        })
        return div
      }

    // start -> AVG / max 10 sensor
    }else if(featureSensor.calType === "AVG"){
      let avg = []
      for(let i=0; i<featureSensor.sensor.length; i++){
        if(i===0){
          avg = filteredSensors[featureSensor.sensor[i].tag].map(function (num, idx) {
            return num + filteredSensors[featureSensor.sensor[i+1].tag][idx]
          })
        }else if(i>1) {
          avg = avg.map(function (num, idx) {
            return num + filteredSensors[featureSensor.sensor[i].tag][idx]
          })
        }
      }
      avg = avg.map(function (num, idx) {
        return num / featureSensor.sensor.length
      })
      return avg
    }else{
      console.error("generateSpecialSensor: calType is not define")
      return []
    }
}

export function maximumSensorSelection({calType, processType}){
  let maxSensors
  if(calType === "ADD" && processType === "sensor"){
      maxSensors = 10
  }else if(calType === "ADD" && processType === "constant"){
      maxSensors = 10
  }else if(calType === 'ABSDIFF' && processType === "sensor"){
      maxSensors = 2
  }else if(calType === 'ABSDIFF' && processType === "constant"){
      maxSensors = 1
  }else if(calType === 'MUL' && processType === "sensor"){
      maxSensors = 10
  }else if(calType === 'MUL' && processType === "constant"){
      maxSensors = 10
  }else if(calType === 'DIV' && processType === "sensor"){
      maxSensors = 2
  }else if(calType === 'DIV' && processType === "constant"){
      maxSensors = 1
  }else if(calType === 'AVG' && processType === "sensor"){
      maxSensors = 10
  }else {
    console.error("maximumSensorSelection: calType is not define")
  }
  return maxSensors
}

export function generateSensorTag({derivedSensors, calType}){
  let shortCal
  if(calType === "ADD"){
      shortCal = "ADD"
  }else if(calType === "ABSDIFF"){
      shortCal = "ABSDIFF"
  }else if(calType === "MUL"){
      shortCal = "MUL"
  }else if(calType === "DIV"){
      shortCal ="DIV"
  }else if(calType === "AVG"){
      shortCal ="AVG"
  }else{
    console.error("generateSensorName: calType is not define")
  }

  let name = shortCal
  if(derivedSensors.length > 0){
      for(let i=0; i<derivedSensors?.length; i++){
          name = name + `_${derivedSensors[i].tag}`
      }
  }
  return name

}