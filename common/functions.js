const helpers = {
    toLowerCaseTransform : (obj) => {
        const newObj = {...obj}
        for (let key in newObj) {
            if (newObj.hasOwnProperty(key) && typeof newObj[key] === 'string')
                newObj[key] = newObj[key].toLowerCase()
        }
        return newObj
    }
}

module.exports = helpers
