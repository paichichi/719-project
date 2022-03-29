const SQL = require("sql-template-strings");
const dbPromise = require("./database.js");

// Retrieve all upvote by comment id
async function retrieveUpvote(commentId) {
    const db = await dbPromise;

    const upvote = await db.all(SQL`
        select isvoted from votes
        where commentId = ${commentId}
        and isvoted = 0`);

    return upvote.length;
}

// Retrieve all downvote by comment id
async function retrieveDownvote(commentId) {
    const db = await dbPromise;

    const downvote = await db.all(SQL`
        select isvoted from votes
        where commentId = ${commentId}
        and isvoted = 1`);

    return downvote.length;
}

// record a upvote...
async function upvote(commentId, userId) {
    const db = await dbPromise;

    await db.run(SQL`
        insert into votes (commentId, userId, isvoted) values
            (${commentId}, ${userId}, 0)`);
}

// record a downvote...
async function downvote(commentId, userId) {
    const db = await dbPromise;

    await db.run(SQL`
        insert into votes (commentId, userId, isvoted) values
            (${commentId}, ${userId}, 1)`);
}

// delete a vote when user double click the thumb-up or thumb-down...
async function deleteVote(commentId, userId) {
    const db = await dbPromise;

    await db.run(SQL`
    delete from votes
    WHERE commentId = ${commentId} AND userId = ${userId}`);
}

// retrieve a specific vote detail...
async function retrieveAVote(commentId, userId) {
    const db = await dbPromise;

    const vote = await db.get(SQL`
        select * from votes
        where commentId = ${commentId}
        and userId = ${userId}`);

    return vote;
}

// retrieve a specific upvote detail...
async function retrieveAUpVote(commentId, userId) {
    const db = await dbPromise;

    const vote = await db.get(SQL`
        select * from votes
        where commentId = ${commentId}
        and userId = ${userId} and isvoted = 0`);

    return vote;
}

// retrieve a specific downvote detail...
async function retreiveADownVote(commentId, userId) {
    const db = await dbPromise;

    const vote = await db.get(SQL`
        select * from votes
        where commentId = ${commentId}
        and userId = ${userId} and isvoted = 1`);

    return vote;
}

// Export vote DAO functions
module.exports = {
    retrieveUpvote,
    retrieveDownvote,
    upvote,
    downvote,
    deleteVote,
    retrieveAVote,
    retrieveAUpVote,
    retreiveADownVote
};