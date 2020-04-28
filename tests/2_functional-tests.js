/*
*
*
*       FILL IN EACH FUNCTIONAL TEST BELOW COMPLETELY
*       -----[Keep the tests in the same order!]-----
*       (if additional are added, keep them at the very end!)
*/

'use strict'

const chaiHttp = require('chai-http');
const chai = require('chai');
const assert = chai.assert;
const server = require('../server');
const newThreadHandler = require('../controllers/newThreadHandler.js')
const replyHandler = require('../controllers/replyHandler.js')

const newThread = new newThreadHandler('testBoard', 'My thread text', 'myPassword');

 

chai.use(chaiHttp);

let boardName, threadId, deletePassword;

suite('Functional Tests', () => {

  suite('API ROUTING FOR /api/threads/:board', () => {
    
    suite('POST', () => {
      
      test('Submit a new thread; board\'s name sent in req.params.board', done => {
        chai.request(server)
          .post('/api/threads/testBoard')
          .send({
            board: newThread.board,
            text: newThread.text,
            created_on: newThread.createdOn,
            bumped_on: newThread.bumpedOn,
            reported: newThread.reported,
            delete_password: newThread.deletePassword,
            replies: newThread.replies
          })
          .end((err, res) => { 
            const index = res.redirects[0].lastIndexOf('/');
            const currentBoard = res.redirects[0].substring(index+1);
            assert.equal(res.status, 200);  
            assert.equal(currentBoard, 'testBoard');
            done();
        })
      })
    });
    
    suite('GET', () => {
      test('Get list of latest 10 threads', done => {
        chai.request(server)
          .get('/api/threads/testBoard')
          .end((err, res) => {
            boardName = res.body[0].board;
            threadId = res.body[0]._id;
            deletePassword = res.body[0].delete_password;
            assert.equal(res.status, 200);  
            assert.isAtMost(res.body.length, 10);
            assert.isAtLeast(res.body.length, 1);
            done();
        });
      });
      
      test('Thread objects in sent JSON have all required properties', done => {
        chai.request(server)
          .get('/api/threads/testBoard')
          .end((err, res) => {
            assert.equal(res.status, 200);  
            assert.property(res.body[0], 'board');
            assert.property(res.body[0], 'text');
            assert.property(res.body[0], 'created_on');
            assert.property(res.body[0], 'bumped_on');
            assert.property(res.body[0], 'reported');
            assert.property(res.body[0], 'delete_password');
            assert.property(res.body[0], 'replies');
            done();
        });
      });
      
    });
    
    suite('DELETE', () => {
       test('Try to delete thread from DB with incorrect password', done => {
         chai.request(server)
           .delete('/api/threads/testBoard')
           .send({
             board: boardName, 
             thread_id: threadId, 
             delete_password: 'This_password_is_incorrect '
           })
           .end((err, res) => {
             assert.equal(res.status, 200); 
             assert.equal(res.text, 'Could not delete a thread: incorrect board name, thread id, or delete password');
             done();
           });
       });
    });
    
    suite('PUT', () => {
      test('Report a thread', done => {
        chai.request(server)
          .put('/api/threads/testBoard')
          .send({
            board: boardName, 
            thread_id: threadId
          })
          .end((err, res) => {
            assert.equal(res.status, 200); 
            assert.equal(res.text, 'reported');
            done();
          });
      });
    });  
  });
  
  
  
  const reply = new replyHandler(threadId, boardName, 'New comment', 'myReplyPassword');
  
  suite('API ROUTING FOR /api/replies/:board', () => {
    
    suite('POST', () => {
      test('Submit a new reply within the given thread', done => {
        chai.request(server)
          .post('/api/replies/testBoard')
          .send({
            board: boardName, 
            thread_id: threadId, 
            text: reply.text,
            delete_password: reply.deletePassword
          })
          .end((err, res) => {
            const index = res.redirects[0].lastIndexOf('/');
            const currentThread = res.redirects[0].substring(index+1);
            assert.equal(res.status, 200);  
            assert.equal(currentThread, threadId);
            done();
          });
      });
    });
    
    suite('GET', function() {
      
    });
    
    suite('PUT', function() {
      
    });
    
    suite('DELETE', function() {
      
    });
    
  });

});
