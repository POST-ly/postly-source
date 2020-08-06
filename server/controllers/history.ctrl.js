/** */
const History = require('./../models/History')
const mongoose = require('mongoose')
const log = console.log

module.exports = {
    createHistory: (req, res, next) => {
        History.create(req.body, (err, history) => {
            if (!err) {
                res.send(history)
            } else {
                res.send({ error: err })
            }
        })
    },

    editHistory: (req, res, next) => {

    },

    getHistoryTeam: (req, res, next) => {
        const teamId = req.params.teamId
    },

    deleteHistory: (req, res, next) => {

    }
}