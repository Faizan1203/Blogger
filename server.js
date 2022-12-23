const express = require("express");
const mongoose = require("mongoose");
const articleRouter = require("./routes/articles");
const methodOverride = require("method-override");
const Article = require("./models/article");
const User = require("./models/users");
const bcrypt = require("bcrypt");
const passport = require("passport");
const initialize_passport = require("./middlewares/passport-config");
const flash = require("express-flash");
const session = require("express-session");
const own_authenticator = require("./middlewares/own_authenticator.js");
const app = express();

require("dotenv").config();

mongoose
  .connect(
    "mongodb+srv://UDS63:Faizan@blog.rh8w0.mongodb.net/myFirstDatabase?retryWrites=true&w=majority"
  )
  .then(() => console.log("Database connected"))
  .catch((err) => {
    console.log(err);
  });

app.set("view engine", "ejs");

app.use(express.urlencoded({ extended: false }));

app.use("/articles", articleRouter);

app.use(methodOverride("_method"));

initialize_passport(passport);

app.use(
  session({
    secret: "hoadsasdaddasw",
    resave: false,
    saveUninitialized: false,
  })
);

app.use(passport.initialize());

app.use(passport.session());

app.use(flash());

app.get("/", async (req, res) => {
  const articles = await Article.find().sort({ created_on: "desc" });
  const user = await User.findById(req.user);
  if (req.isAuthenticated()) {
    res.locals.user = user;
    res.locals.logged_in = true;
  } else {
    res.locals.logged_out = true;
  }
  res.render("universal/index", {
    articles: articles,
  });
});

app.get("/register", own_authenticator.checkNotAuthenticated, (req, res) => {
  res.render("universal/register");
});

app.post("/register", async (req, res) => {
  const first_name = req.body.first_name;
  const last_name = req.body.last_name;
  const dob = req.body.dob;
  const username = req.body.username;
  const email = req.body.email;
  const password = req.body.password;
  const salt = await bcrypt.genSalt();
  const encryptedpassport = await bcrypt.hash(password, salt);
  const new_user = new User({
    first_name: first_name,
    last_name: last_name,
    username: username,
    date_of_birth: dob,
    email: email,
    password: encryptedpassport,
  });
  try {
    new_user.save();
  } catch (e) {
    console.log(e);
  }
  res.redirect("/");
});

app.get("/login", own_authenticator.checkNotAuthenticated, (req, res) => {
  res.render("universal/login");
});

app.post("/login", (req, res, next) => {
  passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/login",
    failureFlash: true,
  })(req, res, next);
});

app.get("/logout", (req, res) => {
  req.logout();
  res.redirect("/");
});

app.listen(process.env.PORT || 5000);
// .then(() => {
//   console.log("app listening on port 5000");
// })
// .catch((err) => {
//   console.log(err);
// });
