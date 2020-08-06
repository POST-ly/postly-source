/** */
// require the module
const mongoose = require("mongoose")
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('./../models/User')
const { hashPassword } = require("./../utils")
const log = console.log

module.exports = {
    checkUser: async (req, res, next) => {
        var { username, password } = req.body

        const user = await User.findOne({
            $or: [{ username }]
        });

        // if no user is found, throw an authentication error
        if (!user) {
            res.send({ error: 'User not found.'});
        } else {
            // if the passwords don't match, throw an authentication error
            const valid = await bcrypt.compare(password, user.password);
            if (!valid) {
                res.send({ error: 'Password does not match.'});
            } else {
                // create and return the json web token
                res.send(jwt.sign({ id: user._id }, "nnamdi" /* process.env.JWTSECRET */))
            }
        }
        next()
    },

    getUserMe: (req, res, next) => {
        if (!req.user) {
            res.send({ error: "You must be signed in to perform this operation." })
        }
        else {
            User.findById(mongoose.Types.ObjectId(req.user.id), { "username": 1, "email": 1 })
                .lean()
                .exec((err, user) => {
                    if (!err) {
                        res.send({
                            username: user.username,
                            email: user.email
                        })
                    } else {
                        res.send({ error: err })
                    }
                })
        }
    },

    getUser: (req, res, next) => {
        log("getting user",req.params.id)
        User.findById(req.params.id, (err, user) => {
            if (err)
                res.send({ error: err })
            else if (!user)
                res.send(404)
            else
                res.send(user)
            next()
        })
    },

    getUserByUsername: (req, res, next) => {
        var username = req.params.username
        if(req.user) {
            var user = req.user
        }

        User.find({ "username": username })
        .lean()
        .exec((err, users) => {
            if (err)
                res.send({ error: err })
            else if (!users)
                res.send(404)
            else {
                if(user) {
                    users = users.filter(u => {
                        u._id !== user.id
                    })
                }
                res.send(users)
            }
            next()
        })
    },

    registerUser: async (req, res, next) => {
        var { email, password, username } = req.body
        
        // normalize email address
        email = email.trim().toLowerCase();

        var hashed = await hashPassword(password)

        try {
            const user = User.create({
                username,
                email,
                password: hashed
            });
            // create and return the json web token
            res.send(jwt.sign({ id: user._id }, "nnamdi"/*process.env.JWT_SECRET*/));
        } catch (err) {
            console.log(err);
            res.send({ error: err })
            // if there's a problem creating the account, throw an error
            // throw new Error('Error creating account');
        }
        next()
    },

    getAllUsers: (req, res, next) => {
        User.find((err, users) => {
            if (err) {
                res.send({ error: err })
                next()
            }
            res.send(users)
            next()
        })
    }
}