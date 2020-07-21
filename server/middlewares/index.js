const jwtMidWare = require("./jwtMidware")

module.exports = (router) => {
    jwtMidWare(router)
}