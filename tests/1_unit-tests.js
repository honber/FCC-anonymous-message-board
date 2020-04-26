/*
*
*
*       FILL IN EACH UNIT TEST BELOW COMPLETELY
*       -----[Keep the tests in the same order!]----
*       (if additional are added, keep them at the very end!)
*/

'use strict'

const chai = require('chai');
const assert = chai.assert;
const server = require('../server');
const display10RecentTreadsEachWith3RecentReplies = require('../routes/functions.js')


const threads = [
  { text: '1', bumped_on: '2020-04-24T13:02:26.837Z', replies: [] },
  { text: '2', bumped_on: '2020-04-24T13:02:32.126Z', replies: [] },
  { text: '3', bumped_on: '2020-04-24T13:02:35.873Z', replies: [] },
  { text: '4', bumped_on: '2020-04-24T13:02:39.422Z', replies: [] },
  { text: '5', bumped_on: '2020-04-24T13:02:43.633Z', replies: [] },
  { text: '6', bumped_on: '2020-04-24T13:02:47.480Z', replies: [] },
  { text: '7', bumped_on: '2020-04-24T13:02:51.342Z', replies: [] },
  { text: '8', bumped_on: '2020-04-24T13:02:55.585Z', replies: [] },
  { text: '9', bumped_on: '2020-04-24T13:03:01.554Z', replies: [] },
  { text: '10', bumped_on: '2020-04-24T13:03:07.138Z', replies: [] },
  { text: '11', bumped_on: '2020-04-25T14:14:55.438Z', replies: [      
        { text: 'komentarz1', created_on: '2020-04-24T13:04:08.442Z' },
        { text: 'komentarz2', created_on: '2020-04-24T13:04:21.848Z' },
        { text: 'komentarz3', created_on: '2020-04-24T13:04:42.965Z' },
        { text: 'komentarz4', created_on: '2020-04-24T13:05:01.889Z' },
        { text: 'komentarz5', created_on: '2020-04-25T14:14:55.438Z' }
  ]},
];

suite('Unit Tests', () => {
  test('Select 10 latest threads. In each thread select 3 latest replies.', done => {
    const result = display10RecentTreadsEachWith3RecentReplies(threads);
    assert.equal(result[0].text, 11);
    assert.equal(result[10], undefined);
    assert.equal(result[0].replies[0].text, 'komentarz5');
    assert.equal(result[0].replies[3], undefined);
    done();
  });
});