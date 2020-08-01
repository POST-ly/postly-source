/** */
const MockServer = require('./../models/MockServer')
const mongoose = require('mongoose')
const log = console.log

module.exports = {
    getMockServers: (req, res, next) => {
    },

    getMockServer: (req, res, next) => {
        var mockServerId = req.params.mockServerId

        MockServer.find({ "mockServerId": mockServerId }, (err, mServer) => {
            if (!err) {
                res.send(mServer)
            } else {
                res.send(err)
            }
        })
    },

    createMockServer: (req, res, next) => {
        MockServer.create(req.body, (err, mockServer) => {
            if (!err) {
                mockServer.MockServerId = mockServer._id
                mockServer.save()
                res.send(mockServer)
            } else{
                res.send(err)
            }
        })
    },

    getTeamMockServers: (req, res, next) => {
        var teamId = req.params.teamId
        MockServer.find({ "teamId": teamId }, (err, mServers) => {
            if (!err) {
                res.send(mServers)                
            } else {
                res.send(err)
            }
        })
    },

    editMockServer: (req, res, next) => {
        var mockServerId = req.params.mockServerId
        const {
            name,
            endpoints
        } = req.body

        MockServer.find({ "MockServerId": mockServerId }, (err, mServer) => {
            if (!err) {
                mServer.name = name
                mServer.endpoints = endpoints
                mServer.save()
                res.send(mServer)
            } else {
                res.send(err)
            }
        })
    },

    deleteMockServer: (req, res, next) => {
        var mockServerId = req.params.mockServerId
        const {
            name,
            endpoints
        } = req.body

        MockServer.find({ "MockServerId": mockServerId }, (err, mServer) => {
            if (!err) {
                mServer.remove()
                res.send(mServer)
            } else {
                res.send(err)
            }
        })
    }
}