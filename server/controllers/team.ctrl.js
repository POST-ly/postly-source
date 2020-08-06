/** */
const mongoose = require("mongoose")

const User = require('./../models/User')
const Team = require('./../models/Team')
const Collection = require("./../models/Collection")
const Request = require("./../models/Request")
const Env = require("./../models/Env")
const collectionCtrl = require("./collection.ctrl")

const log = console.log

module.exports = {
    getTeamById: (req, res, next) => {
        res.send("NOT YET IMPL.")
        next()
    },

    getTeams: (req, res, next) => {
        Team.find((err, teams) => {
            if (err) {
                res.send({ error: err })
                next()
            }
            res.send(teams)
            next()
        })
    },

    /**
    * Populate the collections and the requests in the collection.
     */
    getTeamsColsReqsByUserId: (req, res, next) => {
        var teamId = req.params.teamId        
        if (!req.user)
            res.send({ error: "You must be signed to retrieve your Teams." })
        else {
            var user = mongoose.Types.ObjectId(req.user.id)
            // db.getCollection('teams').find({"users.id": ObjectId("5f189c365649571648725ea3")})
            Team.findById(user, { "name": 1, "collections": 1 })
                .populate("collections")
                .populate("requests")
                .exec((err, team) => {
                    if(!err) {
                        res.send(team)
                    } else {
                        res.send({ error: err })
                    }
            })
        }
    },

    /**
     * This will load all the teams a user belonged to both
     * as owner or viewer.
     */
    getTeamsByUserId: (req, res, next) => {
        if (!req.user)
            res.send({ error: "You must be signed to retrieve your Teams." })
        else {
            var user = mongoose.Types.ObjectId(req.user.id)
            // db.getCollection('teams').find({"users.id": ObjectId("5f189c365649571648725ea3")})
            Team.find({ "users.id": user }, { "name": 1, "teamId": 1, "users": 1 })
                .populate("users.id", { "username": 1, "email": 1 })
                .lean()
                .exec((err, teams) => {
                    if(!err) {
                        teams = teams.map(team => {
                            
                            team.users = team.users.reduce((arr, u) => {
                                if (u.id) {
                                    if (u.id._id.toString() == user.toString()) {
                                        if (!team.role) {
                                            team.role = u.role
                                        }
                                    } else {
                                        u.username = u.id.username
                                        u.email = u.id.email
                                        u.id = u._id
                                        delete u._id                                    
                                        arr.push(u)
                                    }
                                }
                                return arr
                            }, [])
                            delete team._id
                            return team
                        })
                        res.send(teams)
                    } else {
                        res.send({ error: err })
                    }
            })
        }
    },

    createTeam: (req, res, next) => {
        const {
            teamName
        } = req.body

        if (!req.user)
            res.send({ error: "You must be signed to create a Team." })
        else {
            Team.create({
                name: teamName,
                users: [{
                    role: "owner",
                    id: mongoose.Types.ObjectId(req.user.id)
                } ]
            }, (err, newTeam) => {
                    if (!err) {
                        newTeam.teamId = newTeam._id
                        res.send(newTeam)                    
                    } else {
                        res.send({ error: err })
                    }
            })
        }
        next()
    },

    editTeam: (req, res, next) => {

    },
    
    deleteTeam: (req, res, next) => {
        const teamId = req.params.teamId

        // Delete team.
        // delete all collections on teams.
        // delete all requests on collections.
        // delete all envs in the team
        // delete all mockservers in the team
        // remove users on team

        Team.remove({ "id": teamId }, (err) => {
            if (!err) {
                Collection.remove({ "teamId": teamId }, (er) => {
                    if (!er) {
                        Request.remove({ "teamId": teamId }, (e) => {
                            if (!e) {
                                Env.remove({ "teamId": teamId }, (_err) => {
                                    if (!_err) {
                                        MockServer.remove({ "teamId": teamId }, (_er) => {
                                            if (!er) {
                                                res.send({ msg: "Team successfully deleted." })
                                            } else {
                                                res.send({ error: er })
                                            }
                                        })                                        
                                    } else {
                                        res.send({ error: _err })
                                    }
                                })                                
                            } else {
                                res.send({ error: e })
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

    addUserToTeam: (req, res, next) => {
        // TODO: check if the user adding the user has privs.
        // TODO: check if the userToAdd is already on the team.

        const {
            userIdToAdd,
            roleOfUserToAdd,
            teamId
        } = req.body

        if (!req.user) {
            res.send({ error: "You must be signed in to perform this operation." })
            next()
            return
        }
        if (userIdToAdd == undefined || roleOfUserToAdd == undefined || teamId == undefined) {
            res.send({ error: "Error: All fields must be present." })
            next()
            return
        }

        // check the user does not already exist.
        Team.findById(mongoose.Types.ObjectId(teamId), (err, team) => {
            if (!err) {
                team.users.push({ role: roleOfUserToAdd, id: userIdToAdd })
                team.save((e, team) => {
                    if(!e) {
                        res.send(team)
                    } else {
                        res.send({ error: "Error occured while adding user to team." })
                    }
                })
            } else {
                res.send({ error: "Error occurred while adding a user to team." })
            }
        })
    },

    changeUserRoleOnTeam: (req, res, next) => {
        const {
            userIdToChangeRole,
            teamId,
            roleToChangeTo
        } = req.body

        if (!req.user) {
            res.send({ error: "You must be signed in to perform this operation." })
            next()
            return
        }

        if (userIdToChangeRole == undefined || roleToChangeTo == undefined || teamId == undefined) {
            res.send({ error: "Error: All fields must be present." })
            next()
            return
        }

        Team.findById(mongoose.Types.ObjectId(teamId), (err, team) => {
            if (!err) {

                var user = team.users.find(user => {
                    return user.id == userIdToChangeRole
                })

                if (user) {
                    user.role = roleToChangeTo
                    team.save((e, team) => {
                        if (!e) {
                            res.send(team)
                        } else {
                            res.send({ error: "Error occured while adding user to team." })
                        }
                    })                    
                }
            } else {
                res.send({ error: "Error occurred while adding a user to team." })
            }
        })
    },

    removeUserFromTeam: (req, res, next) => {
        const {
            userIdToRemoveFromTeam,
            teamId
        } = req.body

        if (!req.user) {
            res.send({ error: "You must be signed in to perform this operation." })
            next()
            return
        }

        if (userIdToRemoveFromTeam == undefined || teamId == undefined) {
            res.send({ error: "Error: All fields must be present." })
            next()
            return
        }

        Team.findById(mongoose.Types.ObjectId(teamId), (err, team) => {
            if (!err) {

                team.users = team.users.filter(user => {
                    return user.id !== userIdToRemoveFromTeam
                })

                team.save((e, team) => {
                    if (!e) {
                        res.send(team)
                    } else {
                        res.send({ error: "Error occured while adding user to team." })
                    }
                })                    

            } else {
                res.send({ error: "Error occurred while adding a user to team." })
            }
        })
    },

    /**
     * Creates a new collection and adds it to a team
     */
    addCollectionToTeam: (req, res, next) => {
        const {
            collectionName,
            teamId
        } = req.body

        if (!req.user) {
            res.send({ error: "You must be signed in to perform this operation." })
            next()
            return
        }

        if (collectionName == undefined || teamId == undefined) {
            res.send({ error: "Error: The fields must be complete." })
            next()
            return
        }

        Collection.create({
            name: collectionName,
            teamId
        }, (err, collection) => {
            if(!err) {
                collection.collectionId = collection._id
                collection.save()
                Team.findById(mongoose.Types.ObjectId(teamId), (_err, team) => {
                    if (!_err) {
                        team.collections.push(mongoose.Types.ObjectId(collection._id))
                        team.save()
                        res.send(collection)
                        next()
                    } else {
                        res.send({ error: _err })
                    }
                })
            } else {
                res.send({ error: err })
            }
        })
    },

    // This will delete the collection from the team
    // and also delete the request in the collection
    removeCollectionFromTeam: (req, res, next) => {
        const {
            collectionId,
            teamId,
        } = req.body

        if (!req.user) {
            res.send({ error: "You must be signed in to perform this operation." })
            next()
            return
        }

        if (collectionId == undefined || teamId == undefined) {
            res.send({ error: "Error: The fields must be complete." })
            next()
            return
        }

        Collection.findById(collectionId, (err, col) => {
            if (!err) {
                col.remove((err) => {
                    if (!err) {
                        Team.findById(teamId, (er, team) => {
                            if (!er) {
                                team.collections = team.collections.filter(col => {
                                    return col.collectionId !== collectionId
                                })
                                team.save()
                                // Delete reqs on coll
                                Request.remove({"collectionId": collectionId}, (_err) => {
                                    if(!_err) {
                                        res.send(team)
                                        next()
                                    } else {
                                        res.send({ error: _err })
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
            }
        })
    },

    importCollection: (req, res, next) => {
        const col = req.body

        Collection.create({
            name: col.collectionName,
            teamId: col.teamId
        }, (err, collection) => {
            collection.collectionId = collection._id
            collection.save()
            Team.findById(mongoose.Types.ObjectId(col.teamId), (err, team) => {
                if (!err) {
                    team.collections.push(mongoose.Types.ObjectId(collection._id))
                    team.save((_err, _team) => {
                        if (!_err) {
                            if (col.requests) {
                                // for each requests create a Request
                                col.requests.forEach(_req => {
                                    
                                    delete _req.tabId
                                    delete _req.teamId
                                    delete _req.collectionId
                                    delete _req.requestId
                                    
                                    Request.create(_req, (_er, request) => {
                                        if (!err) {
                                            request.requestId = request._id
                                            request.collectionId = collection._id
                                            request.save()

                                            collection.requests.push(request._id)
                                            collection.save()
                                        } else {
                                            res.send({ error: _er })
                                        }
                                    })
                                })
                            }                            
                        } else {
                            res.send({ error: _err })
                        }
                    })
                } else {
                    res.send({ error: err })
                }
            })
        })
    }
}

