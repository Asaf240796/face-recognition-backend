const express = require("express");
const bodyParser = require("body-parser");
const bcrypt = require("bcrypt");
const cors = require("cors");
const knex = require("knex");

const register = require("./controllers/register");
const signin = require("./controllers/signin");
const profile = require("./controllers/profile");
const image = require("./controllers/image");

const db = knex({
  client: "pg",
  connection: {
    host: "127.0.0.1",
    port: 5432,
    user: "postgres",
    password: "1234",
    database: "smart-brain",
  },
});

db.select("*")
  .from("users")
  .then((data) => {
    console.log(data);
  });

const app = express();

app.use(bodyParser.json());
app.use(cors());

//ROOT
app.get("/", (req, res) => {});

//SignIn
app.post("/signin", (req, res) => {
  signin.handleSignin(req, res, db, bcrypt);
});

//Register
app.post("/register", (req, res) => {
  register.handleRegister(req, res, db, bcrypt);
});

app.get("/profile/:id", (req, res) => {
  profile.handleProfileGet(req, res, db);
});

app.put("/image", (req, res) => {
  image.hadleImage(req, res, db);
});

const server = app.listen(1234, () => {
  console.log(`Server is running on port ${server.address().port}`);
});
