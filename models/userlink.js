const mongoose = require('mongoose');

const userlinkSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    discordID: String,
    steamID: String
});

module.exports = mongoose.model('Userlink', userlinkSchema);