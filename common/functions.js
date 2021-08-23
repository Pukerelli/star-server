const dataTransform = (obj) => {
    const newData = {...obj}
    delete newData.country
    delete newData.city
    newData.address = {
        city: obj.city,
        country: obj.country
    }
    return newData
}

const toLowerCaseTransform = (obj) => {
    const newObj = {...obj}
    for (let prop in newObj) {
        if(newObj.hasOwnProperty(prop) && typeof prop === 'string')
        prop.toLowerCase()
    }
    return newObj
}


exports.dataAddressTransform = dataTransform
exports.toLowerCaseTransform = toLowerCaseTransform
