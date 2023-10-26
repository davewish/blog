const express = require("express");
const router = express.Router();
const blogModel = require("../../Models/BlogSchema");
const checkLogin = require("../../middlewares");
//Routes

router.get("/", (req, res) => {
  const locals = {
    Name: "Atomic Hablits",
    createdAt: "10/11/2023",
    description: "this is one of the books on how to create habits",
  };

  res.render("register", { locals });
});

router.post("/", checkLogin, (req, res) => {
  const { title, content, author } = req.body;
  var newblog = new blogModel({ title: title, content: content });
  newblog.author.name = author;

  newblog.save();

  res.redirect("/");
});

module.exports = router;
