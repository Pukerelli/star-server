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
    for (let prop in obj) {
        if(obj.hasOwnProperty(prop) && typeof prop === 'string')
        prop.toLowerCase()
    }
    return obj
}


exports.dataAddressTransform = dataTransform
exports.toLowerCaseTransform = toLowerCaseTransform
