const SQL = require("sql-template-strings");
const dbPromise = require("./database.js");

//this is a function to retrieve all comment.
async function retrieveAllComments() {
    const db = await dbPromise;
    const comments = db.all(SQL`
        select * from comments
        order by timestamp desc`);
    return comments;
}

//this is a function to retrieve all comment from specific article id.
async function retrieveAllCommentsFromContent(articleId){
    const db = await dbPromise;
    const result = await db.all(SQL`
    SELECT comments.*, users.username, users.avatar, users.authToken
    FROM comments, users, articles
    WHERE comments.article_id = articles.id AND comments.user_id = users.id AND  comments.article_id = ${articleId}
    ORDER BY comments.timestamp DESC`);
    return result;
}

//this is a function to add a comment from the specific content when people click submit button.
async function addComment(article_id, content, user_id) {
    const db = await dbPromise;
    await db.run(SQL`
        insert into comments (article_id, timestamp, content, user_id) values
        (${article_id}, datetime('now', 'localtime'), ${content}, ${user_id})`);
}

//this is a function to add a child comment from the specific content when people click the popup submit button.
async function addChildComment(article_id, content, parent_comment_id, user_id) {
    const db = await dbPromise;
    await db.run(SQL`
        insert into comments (article_id, timestamp, content, parent_comment_id, user_id) values
        (${article_id}, datetime('now', 'localtime'), ${content}, ${parent_comment_id}, ${user_id})`);
}

//this is a function to delete a comment from the specific content when people click the small icon.
async function deleteComment(commentId) {
    const db = await dbPromise;
    await db.run(SQL`
    delete from comments
    where id = ${commentId}`);
}

//this is a function to retrive all comment from the specific parent comment when people leave comment under the popup window.
async function retrieveChildcomments(commentId) {
    const db = await dbPromise;
    const result = await db.all(SQL`
            SELECT * FROM  comments
            WHERE parent_comment_id = ${commentId}`);
    return result;
}

//this is a function to retrieve a speific comment from comment id.
async function retrieveACommentFromID(commentId) {
    const db = await dbPromise;
    const result = await db.get(SQL`
            SELECT * FROM  comments
            WHERE id = ${commentId}`);
    return result;
}

//this is a function to record a upvote in a specifc comment.
async function upvote(id, value) {
    const db = await dbPromise;
    await db.run(SQL`
    UPDATE comments
    SET upvote = ${value}
    WHERE id = ${id}`);
}

//this is a function to record a downvote in a specifc comment.
async function downvote(id, value) {
    const db = await dbPromise;
    await db.run(SQL`
    UPDATE comments
    SET downvote = ${value}
    WHERE id = ${id}`);
}

// Export comment DAO functions
module.exports = {
    retrieveAllComments,
    retrieveAllCommentsFromContent,
    addComment,
    addChildComment,
    deleteComment,
    retrieveACommentFromID,
    upvote,
    downvote,
    retrieveChildcomments
};