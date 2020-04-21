'use strict'

const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const threadSchema= new Schema({
    board: String,
    text: String,
    createdon_: String,
    bumpedon_: String,
    reported: Boolean,
    deletepassword_: String,
    replies: Array
})

const threadModel = mongoose.model('threads', threadSchema);

module.exports = threadModel;