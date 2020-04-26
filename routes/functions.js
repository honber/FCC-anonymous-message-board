'use strict'

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

module.exports = display10RecentTreadsEachWith3RecentReplies;