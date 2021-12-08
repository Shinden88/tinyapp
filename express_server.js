const express = require("express");
const app = express();
const PORT = 8080; // default port 8080

const cookieParser = require('cookie-parser');
const bodyParser = require("body-parser");

app.use(bodyParser.urlencoded({extended: true}));
app.use(cookieParser());
app.set("view engine", "ejs");

const generateRandomString = function () {
  let r = Math.random().toString(36).substring(6);
  return r;
};

const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};

app.get("/", (req, res) => {
  res.send("Hello!");
});


app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});

app.get("/hello", (req,res) => {
    const templateVars = {
      username: req.cookies["username"],
      greeting: "Hello World!"
    };
    res.render("Hello_World", templateVars);
});

app.get("/urls", (req, res) => {
  let templateVars = {
   username: req.cookies.username, 
      urls: urlDatabase,
  };
  res.render("urls_index", templateVars);
});

app.get("/urls/new", (req, res) => {
  let templateVars = {
    username: req.cookies.username
  }
  res.render("urls_new",templateVars);  
});

app.get("/urls/:shortURL", (req,res) => {
 let templateVars = {
    username: req.cookies.username, 
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
    urlDatabase[shortURL] = req.body.longURL
    // console.log(urlDatabase[shortURL])
    res.redirect(`/urls/${shortURL}`);
});

app.post("/urls/:shortURL/delete", (req, res) => {
    const shortURL = req.params.shortURL;
    delete urlDatabase[shortURL];
    res.redirect("/urls");  
})

app.post("/urls/:id", (req, res) => {
  const shortURL = req.params.id
  urlDatabase[shortURL] = req.body.longURL
  res.redirect("/urls");
});

app.post("/login", (req,res)=> {
if(req.body.username){
    // let username = req.body.username
    res.cookie("username",req.body.username);
    console.log(`Welcome to Tiny App ${req.body.username}!`);
}
res.redirect("/urls");
});

app.post("/logout", (req, res) => {
res.clearCookie("username")
res.redirect('/urls');   
})


app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});