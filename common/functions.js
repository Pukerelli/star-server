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
    for (let key in newObj) {
        if (newObj.hasOwnProperty(key) && typeof newObj[key] === 'string')
            newObj[key] = newObj[key].toLowerCase()
    }
    return newObj
}


exports.dataAddressTransform = dataTransform
exports.toLowerCaseTransform = toLowerCaseTransform
