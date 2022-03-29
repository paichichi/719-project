const express = require("express");
const router = express.Router();

const upload = require("../middleware/multer-uploader.js");
const fs = require("../middleware/fs-directory_scanner.js");
const jimp = require("../middleware/jimp-image_processor.js");

const articleDao = require("../modules/article-dao.js");
const userDao = require("../modules/users-dao.js");

// this function uploads a new recipe to the articles database
router.post("/uploadRecipe", upload.single("imageFile"), async function(req, res) { 
    
    const user = await userDao.retrieveUserWithAuthToken(req.cookies.authToken);
    
    const title = req.body.title;

    const ingredients = req.body.ingredients;

    const newRecipe = req.body.method;

    const fileInfo = req.file;
    
    try{

        if (fileInfo) {

            const oldFileName = fileInfo.path;
            const newFileName = `./public/images/uploaded_images/${fileInfo.originalname}`;
    
            fs.renameSync(oldFileName, newFileName);

            const image = await jimp.read(newFileName);
            image.resize(1280, 720);
            await image.write(`./public/images/thumbnails/${fileInfo.originalname}`)

            await articleDao.addArticle(title, fileInfo.originalname, ingredients, newRecipe, user.id);
    
        } else {
        
            await articleDao.addArticle(title, "default.jpg", ingredients, newRecipe, user.id);
        }
    
        res.redirect("./userArticles");
        
    }catch(err){

        res.setToastMessage("Please check file type!");
        res.redirect("/");
    }
});

module.exports = router;