const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const path = require("path")

const postsRoutes = require("./routes/posts");
const usersRoutes = require("./routes/users");
const cors = require("cors");

const app = express();

mongoose
    .connect(
      "mongodb+srv://"+
      process.env.MONGO_ATLAS_USER +
      ":"+
      process.env.MONGO_ATLAS_PWD +
      "@cluster0-lzbip.mongodb.net/app-post")
    .then(() => {
        console.log('Connected to database');
    })
    .catch(() => {
        console.log('Connection failed');
    });

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use("/images", express.static(path.join("backend/images")));

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept, Authorization'
  );
  res.setHeader(
    'Access-Control-Allow-Headers',
    'GET, POST, PATCH, PUT, DELETE, OPTIONS'
  );
  next();
});


app.use("/api/posts", postsRoutes);
app.use("/api/user", usersRoutes);

module.exports = app;
