const log = console.log
const mongoose = require('mongoose')

let HistorySchema = new mongoose.Schema({
    teamId: mongoose.Schema.Types.ObjectId,
    requestId: mongoose.Schema.Types.ObjectId
})

module.exports = mongoose.model('History', HistorySchema)


