/** */
const Env = require('./../models/Env')
const log = console.log

module.exports = {
    getEnvs: (req, res, next) => {
        Env.find((err, envs) => {
            if(err) {
                res.send(err)
                next()
            }
            res.send(envs)
            next()
        })
    },
    editEnv: (req, res, next) => {

    },
    createEnv: (req, res, next) => {
        log(req.body)
        var newEnv = Env.create(req.body)
        res.send(newEnv)
    },
    getEnv: (req, res, next) => {

    },
    deleteEnv: (req, res, next) => {

    }
}