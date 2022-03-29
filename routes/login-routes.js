const { v4: uuid } = require("uuid");
const express = require("express");
const router = express.Router();
const bcrypt = require('bcrypt');
const saltRounds = 10;
const userDao = require("../modules/users-dao.js");
const {verifyAuthenticated} = require("../middleware/auth-middleware.js");


//set up a login router, when the login page is called
router.get("/login", function (req, res) {
    //set the title to Login
    res.locals.title = "Login | @FLAVOURFUL";
    //if there's a user, take them to the home page
    if (res.locals.user) {
        res.redirect("/");
    }
    //if there's not a user, ask them to log in again
    else {
        res.render("login");
    }

});

//set up a logout router, when the logout function is called
router.get("/logout", function (req, res) {
    //delete the authToken cookie
    res.clearCookie("authToken");
    //set set the user on the webiste to null
    res.locals.user = null;
    //set the toast message to success message
    res.setToastMessage("Successfully logged out!");
    //redirect the user to the login page
    res.redirect("./login");
});

//set up a home router, check if the user is authenticated
router.get("/", verifyAuthenticated, async function (req, res) {
    //set the title to Home
    res.locals.title = "Home | @FLAVOURFUL";
    //set the user to the current user
    const user = res.locals.user;
    //render the home page
    res.render("home");
});

//set up a post login function, called when the login button is pressed
router.post("/login", async function (req, res) {
    
    // Get the username and password submitted in the form
    const username = req.body.username;
    const password = req.body.password;


    // Find a matching user in the database
    const user = await userDao.retrieveUserWithCredentials(username, password);

    // if there is a matching user...
    if (user) {
        // Auth success - give that user an authToken, save the token in a cookie, and redirect to the homepage.
        const authToken = uuid();
        //set the user's authtoken to the one we created
        user.authToken = authToken;
        //update the user's details with the new authtoken
        await userDao.updateUser(user);
        //set the auth user to the authtoken we created
        res.cookie("authToken", authToken);
        //set the website's user to the one we just created
        res.locals.user = user;
        //redirect to the home page
        res.redirect("/");
    }

    // Otherwise, if there's no matching user...
    else {
        // Auth fail
        res.locals.user = null;
        //set the toast message to fail
        res.setToastMessage("Authentication failed!");
        //redirect the user to the login page
        res.redirect("./login");
    }
});

//set up a get handler for myAccount
router.get("/myAccount", verifyAuthenticated, function (req, res) {
    //set the title of the page to My Account
    res.locals.title = "My Account | @FLAVOURFUL";
    //set the user to the current user
     const user = res.locals.user;
     //render the myaccount page
    res.render("myaccount");

});

//set up a new account get route handler
router.get("/newAccount", async function(req, res) {
    //set the title to New Account
    res.locals.title = "New Account | @FLAVOURFUL";
    //render the new account page
    res.render("new-account");
});

//set up a get all users details route handler
router.get("/getAllUsersDetails", async function(req,res){
    //get all the user details from the database
    const allUserDetail = await userDao.retrieveAllUsers();
    //set the userdetails to a json object
    res.json(allUserDetail);
});

//set up a post delete account request, called when the user clicks delete account
router.post("/deleteAccount", async function(req,res){
    //get the current user via the cookie
    const user = await userDao.retrieveUserWithAuthToken(req.cookies.authToken);
    //if there's a user, delete the user and set the toast message to 'your account
    //has been deleted, then redirect the user to the login page

    try{
        userDao.deleteUser(user.id);
        res.clearCookie("authToken");
        res.setToastMessage("Sorry to see you go! Your account has been deleted.");
        res.redirect("/login")
    } catch(err){
        res.setToastMessage("Sorry, something went wrong!");
        res.redirect("/myAccount");
    }
 });


//set up a post router to new account, called when the user creates a new acount
router.post("/newAccount", function(req, res) {
    //get the information from the form
    let user = {
        username: req.body.username,
        lname: req.body.lname,
        password: req.body.password,
        fname: req.body.fname,
        bio: req.body.bio,
        avatar: req.body.avatar,
        dob: req.body.dob
    };

    //try to create a user using the function in the userDao, set the toast message,
    //redirect the user to login page
    try {
        userDao.createUser(user);
        res.setToastMessage(`Thanks, ${user.fname}! We've created your account. Please log in using your new credentials.`);
        res.redirect("/login")
    }
    catch (err) {
        res.setToastMessage("That username was already taken!");
        res.redirect("/newAccount");
    }

 });

 //set up a post request to myAccount, called when the user wants to change any of their details
 router.post("/myAccount", function(req, res) {
     //get the current user
    const currentUser = res.locals.user;
    //get the current details. If the field is left empty, don't change the 
    //user details. If it's not left empty, change the field to the information the user
    //entered.
    let newUsername = req.body.username;
    if(newUsername == ""){
        newUsername = currentUser.username;};
    let newLname = req.body.lname;
    if(newLname == ""){
        newLname = currentUser.lname;};
    let newPassword = req.body.password;
    if(newPassword == ""){
        newPassword = currentUser.password;
    }else{
        //make sure that the new password is also hashed
        newPassword = bcrypt.hashSync(newPassword, saltRounds);
    }

    let newFname = req.body.fname;
    if(newFname == ""){
        newFname = currentUser.fname;};
    let newBio = req.body.bio
    if(newBio == ""){
        newBio = currentUser.bio;};
    let newAvatar = req.body.avatar;
    if(newAvatar == null){
        newAvatar = currentUser.avatar;};
    let newDob = req.body.dob;
    if(newDob == ""){
        newDob = currentUser.dob;};

    //store changed detaill in new array...
    let newData = {
        username: newUsername,
        lname: newLname,
        password: newPassword,
        fname: newFname,
        bio: newBio,
        avatar: newAvatar,
        dob: newDob,
        authToken: currentUser.authToken,
        id: currentUser.id
    };
    //actually setting the new user data, using the function in the userDao.
    try {
        //update user detail to database...
        userDao.updateUser(newData);
        res.setToastMessage(`Thanks, ${newData.fname}! We've updated your details!`);
        res.redirect("/")
    }
    catch (err) {
        //otherwise, send failed message...
        res.setToastMessage("Something went wrong!");
        res.redirect("/myaccount");
    }

 });

//This is an api function, when a authentication success the 204 response will return, if fail the 401 response will return.
 router.post("/api/login", async function (req, res) {
    // request username and password from html
    const username = req.body.username;
    const password = req.body.password;


    // Find a matching user in the database
    const user = await userDao.retrieveUserWithCredentials(username, password);

    // if matching...
    if (user) {
        const authToken = uuid();
        user.authToken = authToken;
        res.cookie("authToken", authToken);
        await userDao.updateUser(user);
        //return 204 response...
        return res.status(204).send("Successfully authenticated");
    }
    // Otherwise.
    else {
       //return 402 response...
       return res.status(401).send("Fail authenticated");
    }
});

//This is an api function, when user log out successfully the 204 response will return...
router.get("/api/logout", function (req, res) {
    res.clearCookie("authToken");
    //return 204 response...
    return res.status(204).send("Successfully authenticated");
});

//This is an api function, when admin request all users deatil as json, if all action success the 204 response will return. Otherwise, 401 response will return...
router.get("/api/users", async function(req, res){
    //retrieve authtoken from cookies...
    const authToken = req.cookies.authToken;
    //matching user with authtoken...
    const adminUser = await userDao.retrieveUserWithAuthToken(authToken);
    //check the user...
    if(adminUser){
        //if the isadmin = 1, all user detail will return as json...(if isadmin  = 1, user is admin, if isadmin = 0, user is not a admin)...
        if(adminUser.isadmin == 1){

            const allUserInfo = await userDao.retrieveAllUserInfo();
            return res.json(allUserInfo);
        }else{
            //if not equal 1, return 401 response...
            return res.status(401).send("Authentication failed because you are not admin!");
        }
    }else{
        //this user is not exist, return 401 response...
        return res.status(401).send("Authentication failed because user doesn't exist!");
    }

});

//This is an api function, when admin request to delete a users and along with all of their articles and comments, if all action success the 204 response will return. Otherwise, 401 response will return...
router.delete("/api/users/:id", async function(req, res){

    //retrieve authtoken from cookies...
    const authToken = req.cookies.authToken;
    //matching user with authtoken...
    const adminUser = await userDao.retrieveUserWithAuthToken(authToken);

    //matching the user id as the :id properties...
    const userId = req.params.id

    //check the user...
    if(adminUser){
        //if the isadmin = 1, all user detail will return as json...(if isadmin  = 1, user is admin, if isadmin = 0, user is not a admin)...
        if(adminUser.isadmin == 1){
            await userDao.deleteUserByAdimn(userId);
            return res.status(204).send("Successfully delete");
        }else{
             //if not equal 1, return 401 response...
            return res.status(401).send("Delete failed because you are not admin!");
        }
    }else{
         //this user is not exist, return 401 response...
        return res.status(401).send("Delete failed because user doesn't exist!");
    }
});

module.exports = router;