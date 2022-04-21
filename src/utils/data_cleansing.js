export function cleansingSensors({tag, operator, value1, value2, sensors, values, timestamps}){
    let filteredSeries = {}
    if(operator === "inRange"){
        sensors.map((sensor) => {
            let filteredValues = []
            for (let i = 0; i < timestamps.length; i++) {
            if (values[tag][i] >= value1 && values[tag][i] <= value2) {
                filteredValues.push(values[sensor.tag][i])
                filteredSeries[sensor.tag] = filteredValues
            }
            }
            return filteredValues
        })
    }else if (operator === "equal"){
        sensors.map((sensor) => {
            let filteredValues = []
            for (let i = 0; i < timestamps.length; i++) {
            if (values[tag][i] === value1) {
                filteredValues.push(values[sensor.tag][i])
                filteredSeries[sensor.tag] = filteredValues
            }
            }
            return filteredValues
        })
    }else if(operator === "moreThan"){
        sensors.map((sensor) => {
            let filteredValues = []
            for (let i = 0; i < timestamps.length; i++) {
            if (values[tag][i] > value1) {
                filteredValues.push(values[sensor.tag][i])
                filteredSeries[sensor.tag] = filteredValues
            }
            }
            return filteredValues
        })
    }else if(operator === "moreThanEqual"){
        sensors.map((sensor) => {
        let filteredValues = []
        for (let i = 0; i < timestamps.length; i++) {
            if (values[tag][i] >= value1){
                filteredValues.push(values[sensor.tag][i])
                filteredSeries[sensor.tag] = filteredValues
            }
        }
        return filteredValues
        })
    }else if(operator === "lessThan"){
        sensors.map((sensor) => {
        let filteredValues = []
        for (let i = 0; i < timestamps.length; i++) {
            if (values[tag][i] < value1) {
                filteredValues.push(values[sensor.tag][i])
                filteredSeries[sensor.tag] = filteredValues
            }
        }
        return filteredValues
        })
    }else if(operator === "lessThanEqual"){
        sensors.map((sensor) => {
        let filteredValues = []
        for (let i = 0; i < timestamps.length; i++) {
            if (values[tag][i] <= value1){
                filteredValues.push(values[sensor.tag][i])
                filteredSeries[sensor.tag] = filteredValues
            }
        }
        return filteredValues
        })  
    }
    return filteredSeries
}

export function cleansingTimestamps({tag, operator, value1, value2, values, timestamps}){
    let filteredTimestamps = []
    if(operator === "inRange"){
        for (let i = 0; i < timestamps.length; i++) {
            if (values[tag][i] >= value1 && values[tag][i] <= value2) {
                filteredTimestamps.push(timestamps[i])
            }  
        }
    }else if (operator === "equal"){
        for (let i = 0; i < timestamps.length; i++) {
            if (values[tag][i] === value1) {
                filteredTimestamps.push(timestamps[i])
            }  
        }
    }else if(operator === "moreThan"){
        for (let i = 0; i < timestamps.length; i++) {
            if (values[tag][i] > value1) {
            filteredTimestamps.push(timestamps[i])
            }  
        }
    }else if(operator === "moreThanEqual"){
        for (let i = 0; i < timestamps.length; i++) {
            if (values[tag][i] >= value1){
                filteredTimestamps.push(timestamps[i])
            }  
        }
    }else if(operator === "lessThan"){
        for (let i = 0; i < timestamps.length; i++) {
            if (values[tag][i] < value1) {
                filteredTimestamps.push(timestamps[i])
            }  
        } 
    }else if(operator === "lessThanEqual"){
        for (let i = 0; i < timestamps.length; i++) {
            if (values[tag][i] <= value1){
                filteredTimestamps.push(timestamps[i])
            }  
        }

    }
    return filteredTimestamps
}