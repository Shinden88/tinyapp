const express = require("express");
const app = express();
const PORT = 8080; // default port 8080
const bodyParser = require("body-parser");
const cookieParser = require('cookie-parser');

app.use(cookieParser());
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");

const generateRandomString = function () {
  let r = Math.random().toString(36).substring(6);
  return r;
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

const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};

const emailLookUp = email => {
  for (i in users) {
    if (users[i].email === email) {
      return true;
    }
  }
  return false;
};

const pwLookup = password => {
  for (i in users) {
    if (users[i].password === password) {
      return true;
    }
  }
  return false;
};

const findUserByEmail = email => {
  for (i in users) {
    if (users[i].email === email) {
      return users[i];
    }
  }
  return false;
};

app.get("/register", (req, res) => {
  let userId = req.cookies.user_id
  let templateVars = {
    urls: urlDatabase,
    user: users[userId]
  }
  res.render("urls_register", templateVars);
});

app.get("/", (req, res) => {
  res.send("Hello!");
});


app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});

app.get("/hello", (req,res) => {
    let userId = req.cookies.user_id;
    let templateVars = {
      user: users[userId],
      greeting: "Hello World!"
    }
    res.render("Hello_World", templateVars);
});

app.get("/urls", (req, res) => {
  let userId = req.cookies.user_id;
  let templateVars = {
    user: users[userId],
    urls: urlDatabase
  };
  res.render("urls_index", templateVars);
});

app.get("/urls/new", (req, res) => {
  let userId = req.cookies.user_id
  let templateVars = {
    user: users[userId]
  }
  res.render("urls_new", templateVars);
});

app.get("/login", (req, res) => {
  let userId = req.cookies.user_id
  let templateVars = {
    user: users[userId]
  };
  res.render("urls_login", templateVars);
});

app.get("/urls/:shortURL", (req,res) => {
  let userId = req.cookies.user_id
  let templateVars = {
    user: users[userId],
    shortURL: req.params.shortURL,
    longURL: urlDatabase[req.params.shortURL]
  };
  res.render("urls_show", templateVars);
});

app.get("/u/:shortURL", (req,res) => {
    const longURL = urlDatabase[req.params.shortURL]
    const key = req.params.shortURL
    res.redirect(longURL)
});

app.post("/urls", (req, res) => {
    let shortURL = generateRandomString();
    urlDatabase[shortURL] =  req.body.longURL
    // console.log(urlDatabase[shortURL])
    res.redirect(`/urls/${shortURL}`);
});

app.post("/urls/:shortURL/delete", (req, res) => {
    delete urlDatabase[req.params.shortURL]
    res.redirect("/urls");  
});

app.post("/urls/:id", (req,res) => {
const shortURL = req.params.id
urlDatabase[shortURL] = req.body.longURL
res.redirect("/urls");
});

app.post("/login", (req, res) => {
  if (!emailLookUp(req.body.email) || !pwLookup(req.body.apssword)) {
    res.redirect(403, '/login');
  } else if (!req.body.email || !req.body.password) {
    res.redirect(403, '/login');
  } else {
    let user = findUserByEmail(req.body.email);
    res.cookie("uesr_id", user.id);
    res.redirect("/urls");
  }
});

app.post("/logout", (req, res) => {
  res.clearCookie('user_id');
  res.redirect('/urls');
});

app.post("/register", (req, res) => {
  if (emailLookUp(req.body.email)) {
    res.redirect(400, '/register');
  } else if (!req.body.email) {
    res.redirect(400, '/register');
  } else if (!req.body.password) {
    res.redirect(400, '/register');
  } else {
    const newUser = generateRandomString();
    users[newUser] = {
      id: newUser,
      email: req.body.email,
      password: req.body.password
    }
    res.cookie("user_id", users[newUser].id);
    res.redirect("/urls");
  }
});


app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});