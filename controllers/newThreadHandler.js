'use strict'

class newThreadHandler {
  constructor(board, text, deletePassword) {
    this.board = board;
    this.text = text;
    this.createdOn = new Date().toISOString();
    this.bumpedOn = new Date().toISOString();
    this.reported = false;
    this.deletePassword = deletePassword;
    this.replies = [];
  }
};

module.exports = newThreadHandler;