const average = (array) => array.reduce((a, b) => a + b) / array.length
export function generateSamplingData({valuesArr, type}){
    let value
    if(type === "mean"){
        value = average(valuesArr)
    }else if(type === "max"){
        value = Math.max(...valuesArr)
    }else if(type === "min"){
        value = Math.min(...valuesArr);
    }else if(type === "first"){
        value = valuesArr[0]
    }else if(type === "last"){
        value = valuesArr[valuesArr?.length-1]
    }else {
        console.error("samplingData: type is not define");
        return []
    }
    return value

}