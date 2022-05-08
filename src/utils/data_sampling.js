const average = (array) => array.reduce((a, b) => a + b) / array.length
export function generateSamplingData({values, type}){
    let result
    if(type === "mean"){
        result = average(values)
    }else if(type === "max"){
        result = Math.max(...values)
    }else if(type === "min"){
        result = Math.min(...values);
    }else if(type === "first"){
        result = values[0]
    }else if(type === "last"){
        result = values[values?.length-1]
    }else {
        console.error("samplingData: type is not define");
        return []
    }
    return result

}