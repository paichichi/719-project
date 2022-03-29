const express = require("express");
const router = express.Router();

const upload = require("../middleware/multer-uploader.js");
const fs = require("../middleware/fs-directory_scanner.js");
const jimp = require("../middleware/jimp-image_processor.js");

const articleDao = require("../modules/article-dao.js");
const userDao = require("../modules/users-dao.js");

// this function deletes the recipe from the articles table in project-database.db
// all comments and all votes linked to the recipe will also be deleted
router.post("/deleteRecipe", async function(req, res) {
    
    const article_id = req.cookies["articleID"];

    const user = await userDao.retrieveUserWithAuthToken(req.cookies.authToken);

    await articleDao.deleteArticle(article_id, user.id);

    res.redirect("./userArticles");

});

// this router redirects the user to the edit_article.handlebars page
router.post("/editRecipe", async function(req, res) {
    
    const user = await userDao.retrieveUserWithAuthToken(req.cookies.authToken);
    const article_id = req.cookies["articleID"];

    const content = await articleDao.retrieveArticleFromID(article_id);
    // console.log(content);

    const defaultImage = "default.jpg";

    if (content.image == defaultImage) {
        res.locals.defaultImage = defaultImage;
    }
    
    res.locals.user = user;
    res.locals.content = content;
    res.locals.title = "Edit Recipe | @FLAVOURFUL";
    
    res.render("edit_article");

});

// this function updates a recipe in the articles table of project-database.db
router.post("/updateRecipe", upload.single("imageFile"), async function(req, res) { 
    
    const article_id = req.cookies["articleID"];
    
    const editTitle = req.body.title;

    const editIngredients = req.body.ingredients;

    const editRecipe = req.body.method;

    const checkedRadio = req.body.editImage;

    const fileInfo = req.file;
    try{
        if ((checkedRadio == "inputFile") && fileInfo) {
            
            const oldFileName = fileInfo.path;
            const newFileName = `./public/images/uploaded_images/${fileInfo.originalname}`;
    
            fs.renameSync(oldFileName, newFileName);

            const image = await jimp.read(newFileName);
            image.resize(1280, 720);
            await image.write(`./public/images/thumbnails/${fileInfo.originalname}`)

            await articleDao.updateArticleAndImage(article_id, editTitle, fileInfo.originalname, editIngredients, editRecipe);
    
        } else if ((checkedRadio == "inputFile") && !fileInfo) {
        
            await articleDao.updateArticleNotImage(article_id, editTitle, editIngredients, editRecipe);

        } else {

            await articleDao.updateArticleAndImage(article_id, editTitle, checkedRadio, editIngredients, editRecipe);
        }
    
        res.redirect("./userArticles");

    }catch(err){

        res.setToastMessage("Please check file type!");
        
        const user = await userDao.retrieveUserWithAuthToken(req.cookies.authToken);
        const article_id = req.cookies["articleID"];
    
        const content = await articleDao.retrieveArticleFromID(article_id);
        // console.log(content);
    
        const defaultImage = "default.jpg";
    
        if (content.image == defaultImage) {
            res.locals.defaultImage = defaultImage;
        }
        
        res.locals.user = user;
        res.locals.content = content;
        res.locals.title = "Edit Recipe | @FLAVOURFUL";
        
        res.render("edit_article");
    }
});

module.exports = router;