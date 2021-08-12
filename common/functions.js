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

module.exports = dataTransform