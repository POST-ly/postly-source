const log = console.log
const mongoose = require('mongoose')

let EnvSchema = new mongoose.Schema({
    name: String,
    teamId: mongoose.Schema.Types.ObjectId,
    EnvId: mongoose.Schema.Types.ObjectId,
    vars: [ mongoose.Schema.Types.Mixed ]
})

module.exports = mongoose.model('Env', EnvSchema)



