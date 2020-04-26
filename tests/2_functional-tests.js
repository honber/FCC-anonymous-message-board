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

const newThread = new newThreadHandler('testBoard', 'My thread text', 'myPassword');

chai.use(chaiHttp);

suite('Functional Tests', () => {

  suite('API ROUTING FOR /api/threads/:board', () => {
    
    suite('POST', () => {
      
      test('Submit a new thread; board\'s name sent in req.params.board', done => {
        chai.request(server)
          .post('/api/threads/:testBoard')
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
            assert.equal(res.status, 200);  
            done();
        })
      })
    });
    
    suite('GET', function() {
      
    });
    
    suite('DELETE', function() {
      
    });
    
    suite('PUT', function() {
      
    });
    

  });
  
  suite('API ROUTING FOR /api/replies/:board', function() {
    
    suite('POST', function() {
      
    });
    
    suite('GET', function() {
      
    });
    
    suite('PUT', function() {
      
    });
    
    suite('DELETE', function() {
      
    });
    
  });

});
