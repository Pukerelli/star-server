const jwt = require('jsonwebtoken')
const config = require('config')

module.exports = (req, res, next) => {
    if(req.method === 'OPTIONS'){
        return next()
    }
    try{
        const token = req.headers.authorization.split(' ')[1]
        if(!token){
            return res.json({message: 'token error'})
        }
        req.user = jwt.verify(token, config.get('secretKey'))
        next()
    }catch {
        return res.json({error: 'auth error'})
    }
}