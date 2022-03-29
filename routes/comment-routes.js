const express = require("express");
const router = express.Router();
const commentDao = require("../modules/comment-dao.js");
const voteDao = require("../modules/vote-dao.js");

//this router is add first level comment.
router.post("/commentUpload", async function(req, res) {

    //read the article id from the cookies when people click in a specific content.
    const article_id = req.cookies["articleID"];
    const content = req.body.content;
    const userId = res.locals.user.id;

    //add comment from comment DAO.
    await commentDao.addComment(article_id, content, userId);
    res.redirect(`content?id=${article_id}`);
});

//this router is a function to send all comment from a specific article to the client side.
router.get("/commentUpdate", async function(req, res) {

    //read the article id from the cookies when people click in a specific content.
    const article_id = req.cookies["articleID"];
    const data = await getAllComments(article_id);
    res.json(data);
});

//this router is a function to delete a specific comment.
router.get("/deleteComment", async function (req, res) {

    const article_id = req.cookies["articleID"];

    const commentId = req.query.id;
    //this is a function when people click the delete icon, this comment will delete.
    await commentDao.deleteComment(commentId);

    //this is a function when an comment have child comment, check and delete this.
    const firstChild = await commentDao.retrieveChildcomments(commentId);

    //using a loop if have any child comments, delete them.
    for(let i = 0; i < firstChild.length; i++){
        await commentDao.deleteComment(firstChild[i].id);
        const secondChild = await commentDao.retrieveChildcomments(firstChild[i].id);
        for(let l = 0; l < secondChild.length; l++){
            await commentDao.deleteComment(secondChild[l].id);
        }
    }
    res.redirect(`content?id=${article_id}`);
});

//this router is a function to record and display the upvote.
router.get("/voteCommentUp", async function (req, res) {

    const article_id = req.cookies["articleID"];

    const commentId = req.query.id;
    const userId = res.locals.user.id;
    
    //vote DAO record when people cilck upvote icon...
    const vote = await voteDao.retrieveAVote(commentId, userId);

    //if no upvote before...
    if(!vote){
        //upvoting...
        await voteDao.upvote(commentId, userId);
    }else if(vote.isvoted == 0){
        //vote twice will delete previous vote...
        await voteDao.deleteVote(commentId, userId);
    }else if(vote.isvoted == 1){
        //check if downvote, delete downvote and re-upvote
        await voteDao.deleteVote(commentId, userId);
        await voteDao.upvote(commentId, userId);
    }

    //retrieve the number of upvotes cast from vote table
    const countUp = await voteDao.retrieveUpvote(commentId);
    //record the number of upvotes cast to comment table
    await commentDao.upvote(commentId, countUp);

    //retrieve the number of downvotes cast from vote table
    const countDown = await voteDao.retrieveDownvote(commentId);
    //record the number of downvotes cast to comment table
    await commentDao.downvote(commentId, countDown);

    res.redirect(`content?id=${article_id}`);
})

//this router is a function to record and display the downvote.
router.get("/voteCommentDown", async function (req, res) {

    const article_id = req.cookies["articleID"];

    const commentId = req.query.id;
    const userId = res.locals.user.id;

    //vote DAO record when people cilck downvote icon...
    const vote = await voteDao.retrieveAVote(commentId, userId);

    //if no upvote before...
    if(!vote){
        //downvoting...
        await voteDao.downvote(commentId, userId);
    }else if(vote.isvoted == 1){
        //vote twice will delete previous vote...
        await voteDao.deleteVote(commentId, userId);
    }else if(vote.isvoted == 0){
        //check if upvote, delete upvote and re-downvote
        await voteDao.deleteVote(commentId, userId);
        await voteDao.downvote(commentId, userId);
    }

    //retrieve the number of upvotes cast from vote table
    const countUp = await voteDao.retrieveUpvote(commentId);
    //record the number of upvotes cast to comment table
    await commentDao.upvote(commentId, countUp);

    //retrieve the number of downvotes cast from vote table
    const countDown = await voteDao.retrieveDownvote(commentId);
    //record the number of downvotes cast to comment table
    await commentDao.downvote(commentId, countDown);


    res.redirect(`content?id=${article_id}`);
})

//this router is a function to reply to parent comment
router.get("/replyComment", async function(req, res) {

    const article_id = req.cookies["articleID"];
    const commentId = req.query.comment_id;
    const content = req.query.content;
    const id = res.locals.user.id;

    //add child comment to comment table using comment DAO
    await commentDao.addChildComment(article_id, content, commentId, id);

    res.redirect(`content?id=${article_id}`);
});

//this function will be called and response a json to cilent side
async function getAllComments(article_id){

    const comments = await commentDao.retrieveAllCommentsFromContent(article_id);
    return comments;
}
module.exports = router;