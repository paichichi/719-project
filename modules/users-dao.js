const SQL = require("sql-template-strings");
const dbPromise = require("./database.js");
const bcrypt = require("bcrypt");
const saltRounds = 10;

/**
 * Inserts the given user into the database. Then, reads the ID which the database auto-assigned, and adds it
 * to the user.
 * 
 * @param user the user to insert
 */
async function createUser(user) {
    const db = await dbPromise;

    const hash = bcrypt.hashSync(user.password, saltRounds);


    const result = await db.run(SQL`
        insert into users (fname, lname, bio, username, password, dob, avatar) values (${user.fname},${user.lname},${user.bio},${user.username},${hash},${user.dob},${user.avatar})`);
    // Get the auto-generated ID value, and assign it back to the user object.
    
    user.id = result.lastID;
}

/**
 * Gets the user with the given id from the database.
 * If there is no such user, undefined will be returned.
 * 
 * @param {number} id the id of the user to get.
 */
async function retrieveUserById(id) {
    const db = await dbPromise;

    const user = await db.get(SQL`
        select * from users
        where id = ${id}`);

    return user;
}

/**
 * Gets the user with the given username and password from the database.
 * If there is no such user, undefined will be returned.
 * 
 * @param {string} username the user's username
 * @param {string} password the user's password
 */
async function retrieveUserWithCredentials(username, password) {
    const db = await dbPromise;

    const user = await db.get(SQL`
        select * from users
        where username = ${username}`);
        let match = false;
        try{
            match = await bcrypt.compare(password,user.password);
        } catch{
            return;
        }


    if (match==true){
        return user;
    }
}

/**
 * Gets the user with the given authToken from the database.
 * If there is no such user, undefined will be returned.
 * 
 * @param {string} authToken the user's authentication token
 */
async function retrieveUserWithAuthToken(authToken) {
    const db = await dbPromise;

    const user = await db.get(SQL`
        select * from users
        where authToken = ${authToken}`);

    return user;
}

/**
 * Gets an array of all users from the database.
 */
async function retrieveAllUsers() {
    const db = await dbPromise;

    const users = await db.all(SQL`select * from users`);

    return users;
}

/**
 * Updates the given user in the database, not including auth token
 * 
 * @param user the user to update
 */
async function updateUser(user) {

    const db = await dbPromise;

    //also needs a hash
    await db.run(SQL`
        update users
        set username = ${user.username}, password = ${user.password},
            fname = ${user.fname}, authToken = ${user.authToken},
            lname = ${user.lname}, bio = ${user.bio},
             avatar = ${user.avatar}, dob = ${user.dob}
            where id = ${user.id}`);
}

/**
 * Deletes the user with the given id from the database.
 * Also deletes all of the users' comments and articles.
 * @param {number} id the user's id
 */
async function deleteUser(id) {
    const db = await dbPromise;

    await db.run(SQL`
        delete from comments where user_id = ${id}`);

    await db.run(SQL`
        delete from articles where creator_user_id = ${id}`);

    await db.run(SQL`
        delete from users
        where id = ${id}`);
}

async function updateValue(username) {
    //check username for database
    //if username is in database, change #log inner html to "not available"
    //if username is not in database, change #log inner html to "that username is available"
         const db = await dbPromise;
    
        const user = await db.get(SQL`
            select * from users
            where username = ${username}`);
        

        if (user){
            return "That username is not available!"
        } else{
            return "That username is available!";
        }
        

};

async function retrieveAllUserProfile(){
    
    const db = await dbPromise;

    const allUser = await db.all(SQL`
    SELECT users.*, count(articles.id) as authored_by_user
    FROM users, articles
    WHERE users.id = articles.creator_user_id`);

    return allUser;
}

async function retrieveAllUserInfo(){
    
    const db = await dbPromise;

    const allUser = await db.all(SQL`
    SELECT users.id, users.fname, users.lname, users.bio, users.username, users.dob, count(articles.creator_user_id) as "authored"
    FROM users
    LEFT JOIN articles
    on users.id = articles.creator_user_id 
    GROUP by users.id`);

    return allUser;
}

async function deleteUserByAdimn(id){

    const db = await dbPromise;
    await db.run(SQL`
        delete from votes 
        where userId = ${id}`);

    await db.run(SQL`
        delete from comments 
        where user_id = ${id}`);        
        
    await db.run(SQL`
        delete from articles 
        where creator_user_id = ${id}`);   
        
    await db.run(SQL`
        delete from users 
        where id = ${id}`); 
}

// Export users DAO functions
module.exports = {
    createUser,
    retrieveUserById,
    retrieveUserWithCredentials,
    retrieveUserWithAuthToken,
    retrieveAllUsers,
    updateUser,
    updateValue,
    deleteUser,
    retrieveAllUserProfile,
    retrieveAllUserInfo,
    deleteUserByAdimn
};
