const jwt = require("jsonwebtoken")

const User = require('./../models/User')

const log = console.log

// get the user info from a JWT
const getUser = token => {
    if (token) {
        try {
            // return the user information from the token
            return jwt.verify(token, "nnamdi"/*process.env.JWT_SECRET*/);
        } catch (err) {
            // if there's a problem with the token, throw an error
            return { error: true, msg: 'Session invalid' }
        }
    }
};

function jwtAuth(req, res, next) {
    // log("jwtauth midware")
    if (req.headers) {
        if (req.headers.authorization) {
            var auth = req.headers.authorization

            var parts = auth.split(" ")
            var bearer = parts[0]
            var token = parts[1]
            log()
            if (bearer == "Bearer") {
                req.user = getUser(token)
            }
            log(token, req.user)
        }
    }
    next()
}

module.exports = function(router) {
    router.use(jwtAuth)
}