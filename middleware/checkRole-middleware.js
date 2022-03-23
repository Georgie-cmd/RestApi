const jwt = require('jsonwebtoken')

module.exports = function(role) {
    return function(req, res, next) {
        /* This is a middleware that will allow the CORS preflight request to work */
        if(req.method === 'OPTIONS') {
            next()
        }

        try {
            const token = req.headers.authorization.split(' ')[1]
            if(!token) {
                return res.status(401).json({message: 'This user is not authorized...'})
            }

        /* This is checking if the user has the correct role to access the route */
            const decoded = jwt.verify(token, process.env.JWT_SECRET)
            if(!decoded.role !== role) {
                return res.status(403).json({message: 'No access...'})
            }
            req.user = decoded //setting property to the decoded user object

            next() //calling the next middleware in the middleware stack
        } catch(err) {
            res.status(401).json({message: 'This user is not authorized...'})
        }
    }
}