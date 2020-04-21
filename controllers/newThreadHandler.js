'use strict'

class newThreadHandler {
  constructor(board, text, deletePassword) {
    this.board = board;
    this.text = text;
    this.createdon_ = new Date().toISOString();
    this.bumpedon_ = new Date().toISOString();
    this.reported = false;
    this.deletepassword_ = deletePassword;
    this.replies = [];
  }
};

module.exports = newThreadHandler;