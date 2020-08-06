/** */
const Env = require('./../models/Env')
const mongoose = require('mongoose')
const log = console.log

module.exports = {
    getEnvs: (req, res, next) => {
        Env.find((err, envs) => {
            if(err) {
                res.send({ error: err })
                next()
            }
            res.send(envs)
            next()
        })
    },

    getTeamEnvs: (req, res, next) => {
        var teamId = req.params.teamId
        Env.find({ "teamId": teamId }, (err, envs) => {
            if (!err) {
                res.send(envs)
            } else {
                res.send({ error: err })
            }
        })
    },

    editEnv: (req, res, next) => {
        const {
            name,
            EnvId,
            teamId,
            vars
        } = req.body
                
        Env.findOne({ "EnvId": mongoose.Types.ObjectId(EnvId) }, (err, foundEnv) => {
            if (!err) {
                foundEnv.name = name
                foundEnv.vars = vars
                foundEnv.save((_err, savedEnv) => {
                    if (!_err) {
                        res.send(savedEnv)                        
                    } else {
                        res.send({ error: _err })
                    }
                })
            } else {
                res.send({ error: err })
            }
        })
    },
 
    createEnv: (req, res, next) => {
        /*
        name: String,
        teamId: { type: mongoose.Schema.Types.ObjectId, ref: "Team" },
        EnvId: mongoose.Schema.Types.ObjectId,
        vars: [mongoose.Schema.Types.Mixed]
        */        
        const {
            name,
            teamId,
            vars
        } = req.body

        if (req.body.EnvId == "__globalEnv") {
            Env.find({ "EnvId": "__globalEnv" }, (err, foundEnv) => {
                if (!err) {
                    res.send({ error: "Already exist" })
                } else {
                    Env.create({
                        name,
                        teamId,
                        vars,
                        EnvId: "__globalEnv"
                    }, (err, newEnv) => {
                            if (!err) {
                                res.send(newEnv)
                            } else {
                                res.send({ error: err })
                            }
                    })
                }
            })
        } else {
            Env.create(req.body, (err, newEnv) => {
                if (!err) {
                    newEnv.EnvId = newEnv._id
                    newEnv.save()
                    res.send(newEnv)
                } else {
                    res.send({ error: err })
                }
            })
        }
    },
 
    getEnv: (req, res, next) => {

    },

    deleteEnv: (req, res, next) => {
        const {
            EnvId
        } = req.body
 
        Env.find({ "EnvId": EnvId }, (err, env) => {
            if (!err) {
                env.remove()
                res.send(env)
            } else {
                res.send({ error: err })
            }
        })
    }
}