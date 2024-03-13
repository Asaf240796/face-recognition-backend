import express from "express";
import bodyParser from "body-parser";
import bcrypt from "bcrypt";
import cors from "cors";
import knex from "knex";
import dotenv from "dotenv";

import register from "./controllers/register.js";
import signin from "./controllers/signin";
import profile from "./controllers/profile";
import image from "./controllers/image";

const db = knex({
  client: "pg",
  connection: {
    host: "dpg-cnolkdol6cac7399stv0-a",
    port: 5432,
    user: "face_recognition_db_64qy_user",
    password: "1234",
    database: "face_recognition_db_64qy",
  },
});

db.select("*")
  .from("users")
  .then((data) => {
    console.log(data);
  });

dotenv.config();

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
  image.handleImage(req, res, db);
});

app.post("/imageurl", (req, res) => {
  image.fetchImage(req, res);
});

const server = app.listen(1234, () => {
  console.log(`Server is running on port ${server.address().port}`);
});
