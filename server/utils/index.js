const bcrypt = require("bcrypt")
const mongoose = require("mongoose")
const Team = require('./../models/Team')

const log = console.log

/**
 * return false if nothing is inside 
 * tocheck is the key
 * tocheckval is the value tocheck will be
 * */
function getItems(tocheck, tocheckval, arrays) {
    const arrayFiltered = arrays.filter(array => array[tocheck] == tocheckval)
    if(arrayFiltered.length > 0)
        return arrayFiltered
    return false
}

// the cost of processing the salting data, 10 is the default
const saltRounds = 10;

// function for hashing and salting
const passwordEncrypt = async password => {
    return await bcrypt.hash(password, saltRounds)
};

// generate a JWT that stores a user id
const generateJWT = async user => {
    return await jwt.sign({ id: user._id }, process.env.JWT_SECRET);
}

// validate the JWT
const validateJWT = async token => {
    return await jwt.verify(token, process.env.JWT_SECRET);
}

const hashPassword = async (password) => {
    // hash the password
    const hashed = await bcrypt.hash(password, 10);
    return hashed
}

/**
*   userID - The id of the user to check for privs .
*   teamId - The id of the team to lookup user privs.
*   privsToAllow - array that contains the privs to be allowed.
*/
async function checkPrivs(userId, team, privsToAllow) {
    if (!privsToAllow)
        return new Error("privileges to allow must be defined.")

    if(!team)
        return false

    // check the user has privs to delete a team
    userId = mongoose.Types.ObjectId(userId)

    const user = team.users.find(u => u.id.toString() == userId.toString())
    if (user) {
        const userRole = user.role
        if (privsToAllow.indexOf(userRole) != -1) {
            return true
        } else {
            return false
        }
    } else {
        return false
    }
}

module.exports = {
    getItems,
    validateJWT,
    generateJWT,
    passwordEncrypt,
    hashPassword,
    checkPrivs
}