const express = require("express");
const router = express.Router();

const articleDao = require("../modules/article-dao.js");
const commentDao = require("../modules/comment-dao.js");
const userDao = require("../modules/users-dao.js");

// this router is receive the whole articles from the database
router.get("/articles", async function(req, res) {
    res.locals.title = "All Recipes | @FLAVOURFUL";
    const allArticles = await articleDao.retrieveAllArticles();
    res.locals.allArticles = allArticles;
    res.render("articles");
});

// this router is receive the whole articles from the database
router.get("/userArticles", async function(req, res) {
    
    //retrieve a user through the authtoken by User DAO...
    const user = await userDao.retrieveUserWithAuthToken(req.cookies.authToken);

    //if user exist...
    if (user) {
        const userArticles = await articleDao.retrieveUserArticles(user.id);
        if (!userArticles.length) {
            res.locals.noUserRecipes = "Please upload recipes on your @FLAVOURFUL homepage!";
        }    
        res.locals.userArticles = userArticles;
        res.locals.title = "Your Recipes | @FLAVOURFUL";
        res.render("user_articles");
    } else {
        // res.setToastMessage("Please login or create a new @FLAVOURFUL account")
        res.redirect("articles");
    }
});

//this function is receive the specific article from database and show in the content handlebar
router.get("/content", async function(req, res) {

    //record the article id from the request query...
    const articleID = req.query.id;
    //send the article id to cookies
    res.cookie("articleID", articleID);

    //retrieve a user through the article id by User DAO...
    const content = await articleDao.retrieveArticleFromID(articleID);
    //send content to the content handlebars to display...
    res.locals.content = content;

    //retrieve a user through the authtoken by User DAO...
    const user = await userDao.retrieveUserWithAuthToken(req.cookies.authToken);
    if (user && (content.creator_user_id == user.id)) {
        res.locals.userAuthor = user;
    }
    
    // this part is check auth to make sure the delect button appear..
    const authData = req.cookies["authToken"];
    //retrieve all comments from specific aritcle by using the comment DAO...
    const comments = await commentDao.retrieveAllCommentsFromContent(articleID);
 
    //using a loop to compare the authtoken from the cookies and the authtoken from the database...
    if(authData){
    for(let i = 0; i < comments.length; i++){
        if(authData == comments[i].authToken){
            //if matching set value is true...
            comments[i].delectAuth = true;
        }
        else if(content.creator_user_id == user.id){
            comments[i].delectAuth = true;
        }else{
            //otherwise, set the value is false...
            comments[i].delectAuth = false;
        }
        if(authData != null){
            //if matching set value is true...
            comments[i].voteAuth = true;
            comments[i].replyAuth = true;
        }else{
            //otherwise, set the value is false...
            comments[i].voteAuth = false;
            comments[i].replyAuth = false;
        }}
    }

    // the function is convert array of objects with parent id's to a nested tree structure...
    const unflatten = data => {
        const tree = data.map(e => ({...e}))
          .sort((a, b) => a.id - b.id)
          .reduce((a, e) => {
            a[e.id] = a[e.id] || e;
            a[e.parent_comment_id] = a[e.parent_comment_id] || {};
            const parent = a[e.parent_comment_id];
            parent.children = parent.children || [];
            parent.children.push(e);
            return a;
          }, {})
        ;
        return Object.values(tree)
          .find(e => e.id === undefined).children;
      };
        //if no any comment here from a specific article, dont't use the convert function....
        if(comments.length == 0){
              //send nothing to content handlebar...
              res.locals.comments = null;
        }else{
            //convert plain version to tree-structured version...
            const convertedArray = unflatten(comments);
            //create a new array to store the reverse version, to display comments order by time desc...
            let finalComments = [];
            for(let i = convertedArray.length - 1; i >= 0; i--){
                finalComments.push(convertedArray[i]);
            };
            //send reverse version to content handlebar...
            res.locals.comments = finalComments;
        }

    //set the web title...    
    res.locals.title = "Recipe | @FLAVOURFUL";    

    res.render("content");
});


//this function will be invoke when people click the sort button, and re-display the article list...
router.post("/sortBy", async function(req, res) {

    const sortName = req.body.sortName;
    
    //When the user chooses to sort by name, respond to this feature...
    if(sortName == "name"){

        //retrieve article data list from article dao order by name...
        const allArticlesSortByName = await articleDao.retrieveAllArticlesByName();
        res.locals.allArticles = allArticlesSortByName;
        res.locals.sele1 = `selected = ${"selected"}`;
        res.locals.title = "All Recipes | @FLAVOURFUL";
        res.render("articles");
    //When the user chooses to sort by date, respond to this feature...
    }else if(sortName == "date"){

        //retrieve article data list from article dao order by date...
        const allArticlesSortByDate= await articleDao.retrieveAllArticlesByDate();
        res.locals.allArticles = allArticlesSortByDate;
        res.locals.sele2 = `selected = ${"selected"}`;
        res.locals.title = "All Recipes | @FLAVOURFUL";
        res.render("articles");
    //When the user chooses to sort by title, respond to this feature...
    }else if(sortName == "title"){

        //retrieve article data list from article dao order by title...
        const allArticlesSortByTitle= await articleDao.retrieveAllArticlesByTitle();
        res.locals.allArticles = allArticlesSortByTitle;
        res.locals.title = "All Recipes | @FLAVOURFUL";
        res.locals.sele3 = `selected = ${"selected"}`;
        res.render("articles");
    }    
});

// sorts list of user's articles by date or title...
router.post("/userArticlesSortBy", async function(req, res) {

    const user = await userDao.retrieveUserWithAuthToken(req.cookies.authToken);
    const sortName = req.body.sortName;

    if (sortName == "date") {
        const userArticlesSortByDate= await articleDao.retrieveUserArticlesByDate(user.id);
        res.locals.userArticles = userArticlesSortByDate;
        res.locals.sele1 = `selected = ${"selected"}`;
        res.locals.title = "Your Recipes | @FLAVOURFUL";
        res.render("user_articles");
    } else if (sortName == "title") {
        const userArticlesSortByTitle= await articleDao.retrieveUserArticlesByTitle(user.id);
        res.locals.userArticles = userArticlesSortByTitle;
        res.locals.sele2 = `selected = ${"selected"}`;
        res.locals.title = "Your Recipes | @FLAVOURFUL";
        res.render("user_articles");
    }    
});

module.exports = router;