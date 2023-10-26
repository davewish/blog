const express = require("express");
require("dotenv").config();

const path = require("path");
const app = express();
const port = 5000 || process.env.port;
const bodyParser = require("body-parser");
const session = require("express-session");
const expressLayouts = require("express-ejs-layouts");
const bcrypt = require("bcrypt");
const db = require("./db");

app.use(bodyParser.urlencoded({ extended: true }));
const userModel = require("./Models/UserSchema");
const BlogModel = require("./Models/BlogSchema");

app.use(express.static("public"));
const userRoutes = require("./Server/Routes/userRoutes");
const blogRoutes = require("./Server/Routes/blogRoutes");
// Express Configuration
app.set("view engine", "ejs"); // set my view engine to ejs

// app.use(expressLayouts); //use express layout midde ware

app.use("/blogs", blogRoutes);
app.use("/user", userRoutes);
// app.set("Server", "./Routes/main");

app.use(
  session({
    secret: "1234ACCDF10",
  })
);
app.get("/register", (req, res) => {
  res.render("register");
});

app.get("/", async (req, res) => {
  const BlogList = await BlogModel.find();
  res.render("home", { list: BlogList });
});

app.post("/register", (req, res) => {
  const user = new userModel(req.body);
  console.log(user.avatar);
  if (!user.avatar) {
    user.avatar = "/icon.png";
  }

  user.save();

  res.render("register");
});

app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user) {
    res.status(400).send("User not found");
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    res.status(400).send("Incorrect password");
  }

  req.session.userId = user.id;
  res.send("Logged in 100%").status(200);
});

app.get("/logout", (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error("Error destroying the session", err);
      return res.status(500).send("Error logging out");
    }
    res.clearCookie("connect.sid");
    res.redirect("/login");
  });
});

//  Server
app.listen(port, () => {
  console.log("Server is running on http://lvh.me:" + port);
});
