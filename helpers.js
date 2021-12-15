//-----* These functions will be used by the express server *------------

const bcrypt = require('bcryptjs');

const urlDatabase = {
  b6UTxQ: {
    longURL: "https://www.tsn.ca",
    userID: "aJ48lW"
  },
  i3BoGr: {
    longURL: "https://www.google.ca",
    userID: "aJ48lW"
  }
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
  let r = Math.random().toString(36).substring(7);
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
