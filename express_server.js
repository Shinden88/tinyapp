const express = require('express');

const app = express();
const PORT = 8080; // default port 8080
const morgan = require('morgan');
const bodyParser = require('body-parser');
const cookieSession = require('cookie-session');
const bcrypt = require('bcryptjs');

const { generateRandomString, getUserByEmail, getPasswordCheck, urlsForUser, urlDatabase, users } = require('./helpers');

//------------------------------

app.use(cookieSession({
  name: 'session',
  keys: ['key1', 'key2'],
}));

//---------------------------------

app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine', 'ejs');

//-------
app.get('/register', (req, res) => {
  const templateVars = {
    user: req.session.user_id,
  };
  res.render('register_page', templateVars);
});

//-------
app.get('/', (req, res) => {
  res.redirect('/register');
});

//-------
app.get('/urls.json', (req, res) => {
  res.json(urlDatabase);
});

//-------
app.get('/urls', (req, res) => {
  const templateVars = {
    urls: urlsForUser(req.session.user_id),
    user: users[req.session.user_id],
  };
  res.render('urls_index', templateVars);
});

//-------
app.get('/urls/new', (req, res) => {
  if (req.session.user_id) {
    const templateVars = {
      urls: urlDatabase,
      user: users[req.session.user_id],
    };
    return res.render('urls_new', templateVars);
  } else {
    return res.redirect('/login');
  }
});

//--------
app.get('/login', (req, res) => {
  const templateVars = {
    user: req.session.user_id,
  };
  res.render('login_page', templateVars);
});

//----------------
app.get('/urls/:shortURL', (req, res) => {
  const shortURL = req.params.shortURL;
  if (urlDatabase[shortURL] && req.session.user_id === urlDatabase[shortURL].userID) {
    const longURL = urlDatabase[shortURL].longURL;
    const templateVars = {
      shortURL: shortURL,
      longURL: longURL,
      user: users[req.session.user_id],
    };
    return res.render('urls_show', templateVars);
  } else {
    const templateVars = {
      error: '404 Not Found',
    };
    return res.render('404', templateVars);
  }
});

//---------
app.get('/u/:shortURL', (req, res) => {
  const longURL = urlDatabase[req.params.shortURL].longURL;
  res.redirect(longURL);
});

// ----------* Post Routes *-------------
app.post('/urls', (req, res) => {
  const shortURL = generateRandomString();
  const longURL = req.body.longURL;
  urlDatabase[shortURL] = {
    longURL: longURL,
    userID: req.session.user_id,
  };
  res.redirect(`/urls/${shortURL}`);
});

//----------
app.post('/urls/:shortURL/delete', (req, res) => {
  const shortURL = req.params.shortURL;
  if (!req.session.user_id) {
    const templateVars = {
      error: 'Action Not Allowed',
    };
    return res.render('400', templateVars);
  } else if (req.session.user_id === urlDatabase[shortURL].userID) {
    delete urlDatabase[shortURL];
    return res.redirect('/urls');
  } else {
    const templateVars = {
      error: 'Page Not Found',
    };
    return res.render('404', templateVars);
  }
});

//-----------
app.post('/login', (req, res) => {
  const email = req.body.email;
  const password = req.body.password;
  const mailCheck = getUserByEmail(email, users);
  const passCheck = getPasswordCheck(email, password, users);
  if (passCheck && mailCheck) {
    req.session.user_id = mailCheck;
    return res.redirect('/urls');
  } else {
    const templateVars = {
      error: 'Something is wrong!',
    };  
    return res.status(400).render('400', templateVars);
  }
});

//------------
app.post('/logout', (req, res) => {
  req.session = null;
  res.redirect('/urls');
});

//--------------------
app.get('*', (req, res) => {
  if (req.session.user_id) {
    return res.redirect('/urls');
  } else {
    return res.redirect('/login');
  }
});

//-----------
app.post('/register', (req, res) => {
  const email = req.body.email;
  const password = req.body.password;

  if (!email || !password) {
    const templateVars = {
      error: 'Something is wrong!',
    };
    return res.status(400).render('400', templateVars);
  } else if (getUserByEmail(email, users)) {
    const templateVars = {
      error: 'Something is wrong!',
    };
    return res.status(400).render('400', templateVars);
  } else {
    const id = generateRandomString();
    const user = {
      id,
      email,
      hashedPassword: bcrypt.hashSync(password, 10),
    };
    users[id] = user;
    req.session.user_id = user.id;
    return res.redirect('/urls');
  }
});

//-----------
app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});
