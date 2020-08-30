const mongoose = require("mongoose")
/** */
const Collection = require('./../models/Collection')
const Request = require("./../models/Request")

const { checkPrivs } = require("./../utils")

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
        if (!req.user) {
            res.send({ error: "You must be signed to edit this request." })
            next()
            return
        }

        var colId = mongoose.Types.ObjectId(req.params.collectionId)
        // collectionId

        // make collection exists and user has privs
        Collection.findById(colId, (colErr, col) => {
            if (!colErr) {

                // check for privs
                if (!checkPrivs(req.user.id, col.teamId, ["owner", "admin"])) {
                    res.send({ error: "You have no privileges to perform this action." })
                    return
                }

                Request.create(req.body, (err, request) => {
                    if (!err) {
                        request.requestId = request._id
                        request.collectionId = colId
                        request.save()

                        Collection.findById(colId, (er, col) => {
                            col.requests.push(request._id)
                            col.save((e, svdCol) => {
                                if (!e) {
                                    res.send(request)
                                } else {
                                    res.send({ error: e })
                                }
                            })
                        })
                    } else {
                        res.send({ error: err })
                    }
                })                
            } else {
                res.send({ error: colErr })
            }
        })
    },

    // Update a Request.
    updateRequest: (req, res, next) => {
        if (!req.user) {
            res.send({ error: "You must be signed to edit this request." })
            next()
            return
        }

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

                // check for privs
                if (!checkPrivs(req.user.id, request.teamId, ["owner", "admin"])) {
                    res.send({ error: "You have no privileges to perform this action." })
                    return
                }

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
        if (!req.user) {
            res.send({ error: "You must be signed to edit this collection." })
            next()
            return
        }

        const {
            name,
            variables,
            tests,
            prerequest,
            authorization
        } = req.body

        Collection.findById(mongoose.Types.ObjectId(req.body.collectionId), (err, col) => {
            if (!err) {

                // check for privs
                if (!checkPrivs(req.user.id, col.teamId, ["owner", "admin"])) {
                    res.send({ error: "You have no privileges to perform this action." })
                    return
                }

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
        if (!req.user) {
            res.send({ error: "You must be signed to delete this request ." })
            next()
            return
        }

        var reqId = req.body.requestId
        Request.findById(reqId, (err, request) => {
            if(!err) {
                request.remove()

                // remove request from collection "requests" array.
                Collection.find({ "requests": mongoose.Types.ObjectId(reqId) })
                    .exec((er, cols) => {
                        if(!er) {
                            // check for privs
                            if (!checkPrivs(req.user.id, cols.teamId, ["owner", "admin"])) {
                                res.send({ error: "You have no privileges to perform this action." })
                                return
                            }

                            cols.requests = cols.requests.filter(req => {
                                return req !== reqId
                            })

                            cols.save((svdColErr, svdCol) => {
                                if (!svdColErr) {
                                    res.send(request)                                    
                                } else {
                                    res.send({ error: svdColErr })
                                }
                            })
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
        // check the user is authorized.
        if (!req.user) {
            res.send({ error: "You must be signed to edit this Team." })
            next()
            return
        }

        const {
            collectionId,
            collectionName
        } = req.body

        Collection.findById(collectionId, (err, collection) => {
            if (!err) {

                // check for privs
                if (!checkPrivs(req.user.id, collection.teamId, ["owner", "admin"])) {
                    res.send({error: "You have no privileges to perform this action."})
                    return
                }

                collection.name = collectionName
                collection.save((svErr, svCol) => {
                    if (!svErr) {
                        res.send(collection)                                        
                    } else {
                        res.send({ error: svErr })
                    }
                })
            } else {
                res.send({ error: err })
            }
        })
    }
}