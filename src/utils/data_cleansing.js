export function cleansingSensors({tag, operator, value1, value2, sensorsObj, samplingData, samplingTimestamp}){
    let filteredSeries = {}
    if(operator === "inRange"){
        sensorsObj.map((sensor) => {
            let values = []
            for (let i = 0; i < samplingTimestamp.length; i++) {
            if (samplingData[tag][i] >= value1 && samplingData[tag][i] <= value2) {
                values.push(samplingData[sensor.tag][i])
                filteredSeries[sensor.tag] = values
            }
            }
            return values 
        })
    }else if (operator === "equal"){
        sensorsObj.map((sensor) => {
            let values = []
            for (let i = 0; i < samplingTimestamp.length; i++) {
            if (samplingData[tag][i] === value1) {
                values.push(samplingData[sensor.tag][i])
                filteredSeries[sensor.tag] = values
            }
            }
            return values 
        })
    }else if(operator === "moreThan"){
        sensorsObj.map((sensor) => {
            let values = []
            for (let i = 0; i < samplingTimestamp.length; i++) {
            if (samplingData[tag][i] > value1) {
                values.push(samplingData[sensor.tag][i])
                filteredSeries[sensor.tag] = values
            }
            }
            return values 
        })
    }else if(operator === "moreThanEqual"){
        sensorsObj.map((sensor) => {
        let values = []
        for (let i = 0; i < samplingTimestamp.length; i++) {
            if (samplingData[tag][i] >= value1){
                values.push(samplingData[sensor.tag][i])
                filteredSeries[sensor.tag] = values
            }
        }
        return values 
        })
    }else if(operator === "lessThan"){
        sensorsObj.map((sensor) => {
        let values = []
        for (let i = 0; i < samplingTimestamp.length; i++) {
            if (samplingData[tag][i] < value1) {
                values.push(samplingData[sensor.tag][i])
                filteredSeries[sensor.tag] = values
            }
        }
        return values 
        })
    }else if(operator === "lessThanEqual"){
        sensorsObj.map((sensor) => {
        let values = []
        for (let i = 0; i < samplingTimestamp.length; i++) {
            if (samplingData[tag][i] <= value1){
                values.push(samplingData[sensor.tag][i])
                filteredSeries[sensor.tag] = values
            }
        }
        return values 
        })  
    }
    return filteredSeries
}

export function cleansingTimestamps({tag, operator, value1, value2, samplingData, samplingTimestamp}){
    let filteredTimestamps = []
    if(operator === "inRange"){
        for (let i = 0; i < samplingTimestamp.length; i++) {
            if (samplingData[tag][i] >= value1 && samplingData[tag][i] <= value2) {
                filteredTimestamps.push(samplingTimestamp[i])
            }  
        }
    }else if (operator === "equal"){
        for (let i = 0; i < samplingTimestamp.length; i++) {
            if (samplingData[tag][i] === value1) {
                filteredTimestamps.push(samplingTimestamp[i])
            }  
        }
    }else if(operator === "moreThan"){
        for (let i = 0; i < samplingTimestamp.length; i++) {
            if (samplingData[tag][i] > value1) {
            filteredTimestamps.push(samplingTimestamp[i])
            }  
        }
    }else if(operator === "moreThanEqual"){
        for (let i = 0; i < samplingTimestamp.length; i++) {
            if (samplingData[tag][i] >= value1){
                filteredTimestamps.push(samplingTimestamp[i])
            }  
        }
    }else if(operator === "lessThan"){
        for (let i = 0; i < samplingTimestamp.length; i++) {
            if (samplingData[tag][i] < value1) {
                filteredTimestamps.push(samplingTimestamp[i])
            }  
        } 
    }else if(operator === "lessThanEqual"){
        for (let i = 0; i < samplingTimestamp.length; i++) {
            if (samplingData[tag][i] <= value1){
                filteredTimestamps.push(samplingTimestamp[i])
            }  
        }

    }
    return filteredTimestamps
}