const express = require("express");
require("dotenv").config();

const path = require("path");
const app = express();
const port = 5000 || process.env.port;

const bodyParser = require("body-parser");
const session = require("express-session");
const expressLayouts = require("express-ejs-layouts");
const bcrypt = require("bcrypt");
const connectDB= require("./Server/configuration/db.js")
const MongoStore = require("connect-mongo");

app.use(bodyParser.urlencoded({ extended: true }));
const userModel = require("./Models/UserSchema");
const BlogModel = require("./Models/BlogSchema");
const userRoutes = require("./Server/Routes/userRoutes");
const blogRoutes = require("./Server/Routes/blogRoutes");
const { getAllBlogs } = require("./container/BlogContainer.js");
//db connection
connectDB();

app.use(express.static("public"));

// Express Configuration
app.set("view engine", "ejs"); // set my view engine to ejs

// app.use(expressLayouts); //use express layout midde ware


// app.set("Server", "./Routes/main");

function checkLogin(req, res, next) {
  if (!req.session.userId) {
    return res.redirect("/register");
  }
  next();
}

app.use(
  session({
    secret: "1234ACCDF10",
    resave: false,
    saveUninitialized: true,
    store: MongoStore.create({ mongoUrl: process.env.MONGODB_URI }),
  })
);
// app.get("/", (req, res) => {
//   var loggedin = false;
//   if (req.session) {
//     loggedin = true;
//   }
//   res.render("layouts/home", { loggedin: loggedin });
// });

// app.get("/register", (req, res) => {
//   res.render("register");
// });
// app.get("/registeredit", (req, res) => {
//   // get data base
//   res.render("register", { formData: { name: "asier", email: "bla@gm.com" } });
// });
app.use("/blogs", require("./Server/Routes/blogRoutes"));
app.use("/user", require("./Server/Routes/userRoutes"));
app.get("/", async (req, res) => {
  
  try {
  
    const {data ,page, totalPages, hasNextPage} = await getAllBlogs(req,res)
    res.render("layouts/home", {
      
      data,
      currentPage: page,
      totalPages,
      hasNextPage,
      isLoggedIn:false
    });
    
  } catch (error) {
    console.error(error);
    //res.render("error", { error });
  }
});
app.get("/login" ,(req, res)=> {
  res.render("layouts/login")

})
app.get("/register",(req,res)=> {
  res.render("layouts/register")
})
app.post("/register", async(req, res) => {
  
  const user = new userModel(req.body);
 
  if (!user.avatar) {
    user.avatar = "/image1.jpg";
  }
  user.password=  await bcrypt.hash(user.password, 10);

  user.save();
 
  res.render("layouts/login");
});

app.post("/login", async (req, res) => {
  
  const { email, password } = req.body;

  const user = await userModel.findOne({ email });
  if (!user) {
    return res.status(400).send("User not found");
  }

  const isMatch = await bcrypt.compare(password,user.password)
  // await bcrypt.compare(password, user.password);
  if (!isMatch) {
    return res.status(400).send("Incorrect password");
  }

  req.session.userId = user.id;
  
  const {data ,page, totalPages, hasNextPage} = await getAllBlogs(req,res)
  res.render("layouts/home", {
    
    data,
    currentPage: page,
    totalPages,
    hasNextPage,
    isLoggedIn:true
  });
 
  

});
app.get("/createPost",(req, res)=> {
  res.render("layouts/createpost")
})
app.get("/logout", (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error("Error destroying the session", err);
      return res.status(500).send("Error logging out");
    }
    res.clearCookie("connect.sid");
    res.redirect("/");
  });
});



//  Server
app.listen(port, () => {
  console.log("Server is running on http://localhost:" + port);
});
