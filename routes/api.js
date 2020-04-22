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
const replyHandler     = require('../controllers/replyHandler.js')
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
        if (error) { console.log(error.message); }
        res.redirect(`/b/${board}`)
      })
    })
  
    .get(async (req, res) => {
       const boardName = req.params.board;  
       const threadsList = await threadModel.find({board: boardName}, (error, response) => {
           if (error) { console.log(error.message); }
           return response;
         })
         .lean();   
         // The lean option tells Mongoose to skip hydrating the result documents. his makes queries faster and less memory intensive,
         // but the result documents are plain old JavaScript objects (POJOs), not Mongoose documents.
         // This enables freely modifying data retrieved from DB 
    
       threadsList.forEach((el, ind, arr) => {
         arr[ind] = {...el, replycount: el.replies.length};
       });
       res.json(threadsList)
    })
  
    .put((req, res) => {
       const boardName = req.body.board; 
       const threadId = req.body.thread_id; 
       threadModel.findOneAndUpdate({board: boardName, _id: threadId}, {$set: {reported: true}}, {new: true}, (error, response) => {
         if (error) { 
           console.log(error.message);
           res.send(`Thread on board "${boardName}" with id=${threadId} does not exists.`)
         }
         else { 
           response !== null ? res.send('reported') : res.send(`Thread on board "${boardName}" with id=${threadId} does not exists.`);
         };
       })
    })
  
    .delete((req, res) => {
       const boardName = req.body.board; 
       const threadId = req.body.thread_id; 
       const password = req.body.delete_password;
       threadModel.deleteOne({board: boardName, _id: threadId, deletepassword_: password}, (error, response) => {
         if (error) { 
           console.log(error.message);
           res.send('Error: could not delete a thread.');
         }
         else {
           response.deletedCount !== 0 ? res.send('success') : res.send('Could not delete a thread: incorrect board name, thread id, or delete password');
         }
       }) 
  });
    
  
  app.route('/api/replies/:board')
    .post(async (req, res) => {
       const threadId = req.body.thread_id; 
       const boardName = req.body.board; 
       const text = req.body.text;
       const password = req.body.delete_password;
       
       const reply = new replyHandler(threadId, boardName, text, password)
       const newRepliesArrayElement = {
         text: reply.text,
         createdon_: reply.createdOn,
         deletepassword_: reply.deletePassword,
         reported: reply.reported
       }
       const bumpedOn = reply.createdOn;
       
       const threadToUpdate = await threadModel.findOne({_id: threadId, board: boardName}, (error, response) => {
         if (error) { console.log(error.message) }
         return response
         })
         .lean();
        
       if (!threadToUpdate) { res.send(null) } 
       else { 
         const repliesArray = threadToUpdate.replies.slice();
         threadModel.findOneAndUpdate({_id: threadId, board: boardName}, 
           {$set:{
             replies: [...repliesArray, newRepliesArrayElement],
             bumpedon_: bumpedOn
           }}, {new: true}, (error, response) => {
             if (error) { console.log(error.message); }
             else { res.redirect(`/b/${boardName}/${threadId}`)}
         })
        }  
      
    //_id, text, createdon_, deletepassword_, & reported
     
  })

};
