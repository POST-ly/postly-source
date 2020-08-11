const log = console.log
const mongoose = require('mongoose')

let CollectionSchema = new mongoose.Schema({
    collectionId: mongoose.Schema.Types.ObjectId,
    name: String,
    requests: [{ type: mongoose.Schema.Types.ObjectId, ref: "Request" }],
    teamId: { type: mongoose.Schema.Types.ObjectId, ref: "Team" },
    variables: Array,
    tests: String,
    prerequest: String,
    authorization: Object
})

module.exports = mongoose.model('Collection', CollectionSchema)

