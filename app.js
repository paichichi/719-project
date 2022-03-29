/**
 * Main application file.
 * 
 * NOTE: This file contains many required packages, but not all of them - you may need to add more!
 */

// Setup Express
const express = require("express");
const app = express();
const port = 3000;

// Setup Handlebars
const handlebars = require("express-handlebars");
app.engine("handlebars", handlebars({
    defaultLayout: "main"
}));
app.set("view engine", "handlebars");

// Setup body-parser
app.use(express.urlencoded({ extended: false }));

// Setup cookie-parser
const cookieParser = require("cookie-parser");
app.use(cookieParser());

// Make the "public" folder available statically
const path = require("path");
app.use(express.static(path.join(__dirname, "public")));

// Use the toaster middleware
app.use(require("./middleware/toaster-middleware.js"));

// Use the addUser middleware
const { addUserToLocals } = require("./middleware/auth-middleware.js");
app.use(addUserToLocals);

// Setup routes
const articleRouter = require("./routes/articles-routes.js");
app.use(articleRouter);

const loginRouter = require("./routes/login-routes.js");
app.use(loginRouter);

const commentRouter = require("./routes/comment-routes.js");
app.use(commentRouter);

const uploadRecipeRouter = require("./routes/upload-recipe-routes.js");
app.use(uploadRecipeRouter);

const editDeleteRecipeRouter = require("./routes/edit-delete-recipe-routes.js");
app.use(editDeleteRecipeRouter);

// Start the server running.
app.listen(port, function () {
    console.log(`App listening on port ${port}!`);
});