const express = require("express");
// const routes = express.Routes();
const routes = express.Router();

routes.get("/", (req, res) => {
  res.send("hello world");
});

// // routes.get("/:id", (req, res) => {
// //   if (req.params.id) {
// //   } else {
// //   }
// // });

// routes.post("/", (req, res) => {
//   // creating users
// });

// routes.delete("/", (req, res) => {
//   // to remove a user
// });

// routes.put("/", (req, res) => {
//   // update user
// });

module.exports = routes;
