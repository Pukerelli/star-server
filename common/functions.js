const dataTransform = (obj) => {
    const newData = {...obj}
    delete newData.country
    delete newData.city
    newData.address = {
        city: obj.city,
        country: obj.country
    }
    for (let prop in newData) {
        if (newData.hasOwnProperty(prop)) {
            if (prop === newData.address) {
                prop.city.toLowerCase()
                prop.country.toLowerCase()
                continue
            }
            prop.toLowerCase()
        }
    }

    return newData
}

module.exports = dataTransform