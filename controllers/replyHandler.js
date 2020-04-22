'use strict'

class replyHandler {
  constructor(threadId, boardName, text, deletePassword) {
    this.threadId = threadId;
    this.boardName = boardName;
    this.createdOn = new Date().toISOString();
    this.text = text;
    this.deletePassword = deletePassword;
    this.reported = false;
  }
}

module.exports = replyHandler


