
export function generateSpecialSensor({filteredSensors, specialSensor}){
    // start -> ADD / max 10 sensor 
    if(specialSensor.calType === "ADD"){
      if(specialSensor.constant === undefined){
        let avg = []
        for(let i=0; i<specialSensor.sensor.length; i++){
          if(i===0){
            avg = filteredSensors[specialSensor.sensor[i].tag].map(function (num, idx) {
              return num + filteredSensors[specialSensor.sensor[i+1].tag][idx]
            })
          }else if(i>1) {
            avg = avg.map(function (num, idx) {
              return num + filteredSensors[specialSensor.sensor[i].tag][idx]
            })
          }
        }
        return avg
      }else if(specialSensor.constant !== undefined){
        let avg = filteredSensors[specialSensor.sensor[0].tag].map(function (num, idx) {
          return num + specialSensor.constant
        })
        return avg
      }

    // start -> abs ABSDIFF  / max 2 sensor 
    }else if(specialSensor.calType === "ABSDIFF"){
      if(specialSensor.constant === undefined){
        let ABSDIFF = filteredSensors[specialSensor.sensor[0].tag].map(function (num, idx) {
          return Math.abs(num - filteredSensors[specialSensor.sensor[1].tag][idx])
        })
        return ABSDIFF
      }else if(specialSensor.constant !== undefined){
        let ABSDIFF = filteredSensors[specialSensor.sensor[0].tag].map(function (num, idx) {
          return Math.abs(num - specialSensor.constant)
        })
        return ABSDIFF
      }
      
    // start -> MUL / max 10 sensor
    }else if(specialSensor.calType === "MUL"){
      // if(specialSensor.constant === undefined){
      //   let mul = filteredSensors[specialSensor.sensor[0]].map(function (num, idx) {
      //     return num * filteredSensors[specialSensor.sensor[1]][idx];
      //   })
      //   return mul
      // }else if(specialSensor.constant !== undefined){
      //   let mul = filteredSensors[specialSensor.sensor[0]].map(function (num, idx) {
      //     return num * specialSensor.constant
      //   })
      //   return mul
      // }
      let mul = []
      for(let i=0; i<specialSensor.sensor.length; i++){
        if(i===0){
          mul = filteredSensors[specialSensor.sensor[i].tag].map(function (num, idx) {
            return num * filteredSensors[specialSensor.sensor[i+1].tag][idx]
          })
        }else if(i>1) {
          mul = mul.map(function (num, idx) {
            return num * filteredSensors[specialSensor.sensor[i].tag][idx]
          })
        }
      }
      if(specialSensor.constant !== undefined){
        mul = mul.map(function (num, idx) {
          return num * specialSensor.constant
        })
      }

    // start -> DIV / max 2 sensor
    }else if(specialSensor.calType === "DIV"){
      if(specialSensor.constant === undefined){
        let div = filteredSensors[specialSensor.sensor[0].tag].map(function (num, idx) {
          return num /filteredSensors[specialSensor.sensor[1].tag][idx]
        })
        return div
      }else if(specialSensor.constant !== undefined){
        let div =  filteredSensors[specialSensor.sensor[0].tag].map(function (num, idx) {
          return num / specialSensor.constant
        })
        return div
      }

    // start -> AVG / max 10 sensor
    }else if(specialSensor.calType === "AVG"){
      let avg = []
      for(let i=0; i<specialSensor.sensor.length; i++){
        if(i===0){
          avg = filteredSensors[specialSensor.sensor[i].tag].map(function (num, idx) {
            return num + filteredSensors[specialSensor.sensor[i+1].tag][idx]
          })
        }else if(i>1) {
          avg = avg.map(function (num, idx) {
            return num + filteredSensors[specialSensor.sensor[i].tag][idx]
          })
        }
      }
      avg = avg.map(function (num, idx) {
        return num / specialSensor.sensor.length
      })
      return avg
    }else if(specialSensor.calType === "WHERE >"){
      let where = []
      where = filteredSensors[specialSensor.sensor[0].tag].map((num, idx) => {
        return num > filteredSensors[specialSensor.sensor[1].tag][idx] ? num : filteredSensors[specialSensor.sensor[1].tag][idx]
      })
      return where
    }else{
      // console.error("generateSpecialSensor: calType is not define")
      return []
    }
}

export function maximumSensorSelection({calType, constant}){
  let maxSensors
  if(calType === "ADD" && constant === false){
      maxSensors = 10
  }else if(calType === "ADD" && constant === true){
      maxSensors = 10
  }else if(calType === 'ABSDIFF' && constant === false){
      maxSensors = 2
  }else if(calType === 'ABSDIFF' && constant === true){
      maxSensors = 1
  }else if(calType === 'MUL' && constant === false){
      maxSensors = 10
  }else if(calType === 'MUL' && constant === true){
      maxSensors = 10
  }else if(calType === 'DIV' && constant === false){
      maxSensors = 2
  }else if(calType === 'DIV' && constant === true){
      maxSensors = 1
  }else if(calType === 'AVG' && constant === false){
      maxSensors = 10
  }else if(calType === 'AVG' && constant === true){
    maxSensors = 0
  }else if(calType === 'select') {
      maxSensors = 0
      // console.error("maximumSensorSelection: calType is not define")
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
    // console.error("generateSensorName: calType is not define")
  }

  let name = shortCal
  if(derivedSensors.length > 0){
      for(let i=0; i<derivedSensors?.length; i++){
          name = name + `_${derivedSensors[i].tag}`
      }
  }
  return name

}