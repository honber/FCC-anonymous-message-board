'use strict'

const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const replySchema = new Schema({
    text: String,
    created_on: String,
    delete_password: String,
    reported: Boolean
});

const threadSchema= new Schema({
    board: String,
    text: String,
    created_on: String,
    bumped_on: String,
    reported: Boolean,
    delete_password: String,
    replies: [replySchema]
});

const threadModel = mongoose.model('threads', threadSchema);

module.exports = threadModel;