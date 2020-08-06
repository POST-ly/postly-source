const user = require('./user')
const team = require("./team.js")
const collection =  require("./collection.js")
const env = require("./env.js")
const mockServer = require("./mockServer.js")
const history = require("./history.js")
const midWares = require("./../middlewares")

module.exports = (router) => {
    midWares(router),
    user(router),
    collection(router),
    team(router),
    env(router),
    mockServer(router),
    history(router)
}