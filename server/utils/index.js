const bcrypt = require("bcrypt")
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

module.exports = {
    getItems,
    validateJWT,
    generateJWT,
    passwordEncrypt,
    hashPassword
}