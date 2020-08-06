const mongoose = require("mongoose")
/** */
const Collection = require('./../models/Collection')
const Request = require("./../models/Request")
const Team = require("./../models/Team")
const log = console.log

module.exports = {
    getCollectionsByTeamId: (req, res, next) => {
        var teamId = req.params.teamId
        Collection.find({ "teamId": mongoose.Types.ObjectId(teamId) })
            .populate("requests")
            .exec((err, cols) => {
                if(!err) {
                    res.send(cols)
                } else {
                    res.send({ error: err })
                }
            })
    },
    
    getAllCollections: (req, res, next) => {
        res.send(Collection.find({}))
    },

    // Create a new Request and add it to a Collection.
    addNewRequest: (req, res, next) => {
        var colId = mongoose.Types.ObjectId(req.params.collectionId)
        // collectionId
        // 
        Request.create(req.body, (err, request) => {
            if (!err) {
                request.requestId = request._id
                request.collectionId = colId
                request.save()

                Collection.findById(colId, (er, col) => {
                    col.requests.push(request._id)
                    col.save()
                })
                if (!er) {
                    res.send(request)
                } else {
                    res.send({ error: er })
                }
            } else {
                res.send({ error: err })
            }
        })
    },

    // Update a Request.
    updateRequest: (req, res, next) => {
        const {
            url,
            methodType,
            body,
            params,
            name,
            headers,
            tests,
            prerequest,
            visualizer,
            variables
        } = req.body

        Request.findById(req.body.requestId, (err, request) => {

            if (!err) {
                request.url = url
                request.methodType = methodType
                request.body = body
                request.params=params
                request.name=name
                request.headers=headers
                request.tests = tests
                request.prerequest = prerequest
                request.visualizer=visualizer
                request.variables = variables

                request.save((er, savedReq) => {
                    if (!er) {
                        res.send(savedReq)
                    } else {
                        res.send({ error: "Error occured when updating request" })
                    }
                })                
            } else {
                res.send({ error: err })
            }
        })        
    },

    // Update collection
    updateCollection: (req, res) => {
        const {
            name,
            variables,
            tests,
            prerequest,
            authorization
        } = req.body

        Collection.findById(mongoose.Types.ObjectId(req.body.collectionId), (err, col) => {
            if (!err) {
                col.name = name
                col.variables = variables
                col.tests = tests
                col.prerequest = prerequest
                col.authorization = authorization
                col.save((_err, updatedCol) => {
                    if (!_err) {
                        res.send(updatedCol)
                    } else {
                        res.send({ error:  _err })
                    }
                })
            } else {
                res.send({ error: err })
            }
        })
    },

    // Delete a Request.
    deleteRequest: (req, res, next) => {
        var reqId = req.body.requestId
        Request.findById(reqId, (err, request) => {
            if(!err) {
                request.remove()

                // remove request from collection "requests" array.
                Collection.find({ "requests": mongoose.Types.ObjectId(reqId) })
                    .exec((er, cols) => {
                        if(!er) {
                            cols.requests = cols.requests.filter(req => {
                                return req !== reqId
                            })
                            cols.save()
                            res.send(request)
                        } else {
                            res.send({ error: er })
                        }
                })
            } else {
                res.send({ error: err })
            }
        })
    },

    renameCollection: (req, res, next) => {
        const {
            collectionId,
            collectionName
        } = req.body
        Collection.findById(collectionId, (err, collection) => {
            if (!err) {
                collection.name = collectionName
                collection.save()
                res.send(collection)                
            } else {
                res.send({ error: err })
            }
        })
    }
}