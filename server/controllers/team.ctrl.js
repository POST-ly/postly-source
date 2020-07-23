/** */
const mongoose = require("mongoose")

const Team = require('./../models/Team')
const Collection = require("./../models/Collection")
const Request = require("./../models/Request")

const log = console.log

module.exports = {
    getTeamById: (req, res, next) => {
        res.send("NOT YET IMPL.")
        next()
    },

    getTeams: (req, res, next) => {
        Team.find((err, teams) => {
            if (err) {
                res.send(err)
                next()
            }
            res.send(teams)
            next()
        })
    },
    getTeamsByUserId: (req, res, next) => {
    },

    createTeam: (req, res, next) => {
        const {
            teamName
        } = req.body

        if (!req.user)
            res.send("You must be signed to create a Team.")
        else {
            var newTeam = Team.create({
                name: teamName,
                users: [{
                    role: "owner",
                    id: mongoose.Types.ObjectId(req.user.id)
                } ]
            })
            res.send(newTeam)
        }
        next()
    },

    addUserToTeam: (req, res, next) => {
        // TODO: check if the user adding the user has privs.
        
        const {
            userIdToAdd,
            roleOfUserToAdd,
            teamId
        } = req.body
        
        if (!req.user) 
            res.send("You must be signed in to perfomr this operation.")
        Team.findById()
        
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

