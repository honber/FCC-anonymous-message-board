/*
*
*
*       Complete the API routing below
*
*
*/

'use strict';

const mongoose         = require('mongoose');
const expect           = require('chai').expect;
const newThreadHandler = require('../controllers/newThreadHandler.js');
const threadModel      = require('../models/threads.js');


const CONNECTION_STRING = process.env.MLAB_URI;

const connectOptions = { 
  useFindAndModify: false,
  useNewUrlParser: true,
  useUnifiedTopology: true
};

mongoose.connect(CONNECTION_STRING, connectOptions, err => {
  if (err) {
    console.log('Could NOT connect to database: ', err);
  }
  else {
    console.log('Connection to database succesful'); 
  }
});


module.exports = function (app) {
    
  app.route('/api/threads/:board')
    .post((req, res) => {
      const board          = req.params.board;
      const text           = req.body.text;
      const deletePassword = req.body.delete_password;

      const newThread = new newThreadHandler(board, text, deletePassword);

      const newThreadToSaveInDB = new threadModel({
        board: newThread.board,
        text: newThread.text,
        createdon_: newThread.createdon_,
        bumpedon_: newThread.bumpedon_,
        reported: newThread.reported,
        deletepassword_: newThread.deletepassword_,
        replies: newThread.replies
      })
      newThreadToSaveInDB.save((error, response) => {
        if (error) { console.log(error); }
        res.redirect(`/b/${board}`)
      })
    })
  
    .get((req, res) => {
       const boardName = req.params.board;  
       threadModel.find({board: boardName}, (error, response) => {
         if (error) { console.log(error); }
         res.json(response);
       })
    })
    
  app.route('/api/replies/:board');

};
