/** */
const Team = require('./../models/Team')
const Collection = require("./../models/Collection")
const Request = require("./../models/Request")

const log = console.log

module.exports = {
    getTeamById: (req, res, next) => {
        Team.getTeamById(req.params.id, (err, team) => {
            if (err)
                res.send(err)
            else if (!team)
                res.send(404)
            else
                res.send(team)
            next()
        })        
    },
    getTeams: (req, res, next) => {
        Team.getTeams((err, teams) => {
            if (err)
                res.send(err)
            else if (!teams)
                res.send(404)
            else
                res.send(teams)
            next()            
        })
    },
    getTeamsByUserId: (req, res, next) => {
    },
    createTeam: (req, res, next) => {
        /*
        const {
            userId,
            teamName
        } = req.body
        */
        var newTeam = Team.create(req.body)
        res.send(newTeam)
    },

    addUserToTeam: (req, res, next) => {
        // TODO: check if the user adding the user has privs.
        /*
        const {
            userIdToAdd,
            roleOfUserToAdd,
            userId,
            teamId
        } = req.body
        */
        
    },

    changeUserRoleOnTeam: (req, res, next) => {
        const {
            userIdToChangeRole,
            userId,
            teamId,
            roleToChangeTo
        } = req.body
    },

    removeUserFromTeam: (req, res, next) => {
        const {
            userIdToRemoveFromTeam,
            userId,
            teamId
        } = req.body
    },

    addCollectionToTeam: (req, res, next) => {
        const {
            collectionName,
            userId,
            teamId
        } = req.body
        Collection.addACollection({
            name: collectionName,
            teamId
        }, (err, newCollection) => {
            if(!err) {
                res.send({ success: true, msg: "Collection added.", ...newCollection})
            } else {
                res.send({ error: true, msg: "Cannot add collection to team."})
            }
        })
    },

    // This will delete the collection from the team
    // and also delete the request in the collection
    removeCollectionFromTeam: (req, res, next) => {
        const {
            collectionId,
            teamId,
            userId
        } = req.body
        Collection.removeCollectionFromTeam({
            collectionId,
            teamId,
            userId
        }, (err, removedCol) => {
            if(!err) {
                Request.removeRequestByCollectionId({
                    collectionId,
                    userId
                }, (err, removedReq) => {
                    res.send({ success: true, msg: "Collection removed from team." })
                })
            } else {
                res.send("Error occured when remvoing collection")
            }
        })
    }
}

