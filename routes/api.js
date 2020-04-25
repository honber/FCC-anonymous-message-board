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


function display10RecentTreadsEachWith3RecentReplies(threadsList) {
  const threads = threadsList.slice();
  threads
  .sort((a, b) => {
    if(a. bumped_on > b. bumped_on) { return -1 }
    else {return 1}
  })
  .splice(10);
  
  threads
  .forEach((el, ind, arr) => {
    arr[ind].replies = el.replies
    .sort((a, b) => {
      if(a.created_on > b.created_on) { return -1 }
      else {return 1}
    })
    .splice(0, 3);
  });
  
  return threads
}



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
        created_on: newThread.createdOn,
        bumped_on: newThread.bumpedOn,
        reported: newThread.reported,
        delete_password: newThread.deletePassword,
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
       res.json(display10RecentTreadsEachWith3RecentReplies(threadsList));
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
       threadModel.deleteOne({board: boardName, _id: threadId, delete_password: password}, (error, response) => {
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
         created_on: reply.createdOn,
         delete_password: reply.deletePassword,
         reported: reply.reported
       }
       const bumpedOn = reply.createdOn;
       
       const threadToUpdate = await threadModel.findOne({_id: threadId, board: boardName}, (error, response) => {
           if (error) { console.log(error.message) }
           return response
         });
        
       if (!threadToUpdate) { res.send(null) } 
       else { 
         threadToUpdate.bumped_on = bumpedOn;
         threadToUpdate.replies.push(newRepliesArrayElement);
         threadToUpdate.save((error, response) => {
           if (error) { console.log(error.message); }
           res.redirect(`/b/${boardName}/${threadId}`)
         })
        }     
    })

    .get((req, res) => {
      const boardName = req.params.board;
      const threadId = req.query.thread_id;
      console.log(boardName + ' ' + threadId);
      threadModel.findOne({_id: threadId, board: boardName}, (error, response) => {
        if (error) { console.log(error.message); }
        res.json(response)
      });
    })
  
    .put(async (req, res) => {
      const boardName = req.body.board; 
      const threadId = req.body.thread_id; 
      const replyId = req.body.reply_id;
    
      const threadToUpdate = await threadModel.findOne({_id: threadId, board: boardName}, (error, response) => {
           if (error) { console.log(error.message) }
           return response
         });
      
      const replyToUpdate = threadToUpdate.replies.id(replyId);
      const indexOfReplyToUpdateInRepliesArray = threadToUpdate.replies.indexOf(replyToUpdate);
      threadToUpdate.replies[indexOfReplyToUpdateInRepliesArray].reported = true
    
      threadToUpdate.save((error, response) => {
        if (error) { console.log(error.message); }
        else { res.send('reported'); }
      });
    })
  
    .delete(async (req, res) => {
      const boardName = req.body.board; 
      const threadId = req.body.thread_id; 
      const replyId = req.body.reply_id;
      const deletePassword = req.body.delete_password;
    
      console.log(deletePassword)
      const threadToUpdate = await threadModel.findOne({_id: threadId, board: boardName}, (error, response) => {
           if (error) { console.log(error.message) }
           return response
         });
    
      const replyToUpdate = threadToUpdate.replies.id(replyId);
      const indexOfReplyToUpdateInRepliesArray = threadToUpdate.replies.indexOf(replyToUpdate);
    
      if (threadToUpdate.replies[indexOfReplyToUpdateInRepliesArray].delete_password === deletePassword) {
        threadToUpdate.replies[indexOfReplyToUpdateInRepliesArray].text = '[deleted]';
        threadToUpdate.save((error, response) => {
          if (error) { console.log(error.message); }
          else { res.send('success'); }
        });
      }
      else {
        res.send('incorrect password');
      }
    });
    
};
