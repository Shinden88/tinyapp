//-----* These functions will be used by the express server *------------

const bcrypt = require('bcryptjs');

const urlDatabase = {
  "b2xVn2":{longURL: "http://www.lighthouselabs.ca", userId:"aJ48LW" } ,
  "9sm5xK": {longURL:"http://google.com", userId:"aJ48LW"}
};



const users = {
  "userRandomID": {
    id: "userRandomID",
    email: "user@example.com",
    password: "abc"
  },
  "user2RandomID": {
    id: "user2RandomID",
    email: "user2@example.com",
    password: "cba"
  }
};


//---------* URL shortening *------------------
const generateRandomString = function () {
  let r = Math.random().toString(36).substring(6);
  return r;
};

//--------* Email verification (if already used or not) *------------
const getUserByEmail = function(email, users) {
  for (let user in users) {
    if (users[user].email === email) {
      return users[user].id;
    }
  }
};


//----------* Password verification *---------------------
const getPasswordCheck = function(email, password, users) {
  console.log(users);
  for (let user in users) {
    if (users[user].email === email && bcrypt.compareSync(password, users[user].hashedPassword)) {
      return true;
    }
  }
  return false;
};


//----------------------------------------------------
const urlsForUser = function(id) {
  let urls = {};
  for (let shortURL in urlDatabase) {
    if (id === urlDatabase[shortURL].userID) {
      urls[shortURL] = urlDatabase[shortURL];
    }
  }
  return urls;
};



module.exports = { generateRandomString, getUserByEmail, getPasswordCheck, urlsForUser, urlDatabase, users };
