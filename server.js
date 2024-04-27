import express from "express";
import bodyParser from "body-parser";
import bcrypt from "bcrypt";
import cors from "cors";
import knex from "knex";
import dotenv from "dotenv";

import { handleRegister } from "./controllers/register.js";
import { handleSignin } from "./controllers/signin.js";
import { handleProfileGet } from "./controllers/profile.js";
import { fetchImage, handleImage } from "./controllers/image.js";

const port = process.env.PORT || 4000;

const db = knex({
  client: "pg",
  connection: {
    connectString: process.env.DATABASE_URL,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    ssl: { rejectUnauthorized: false },
  },
});

db.raw("SELECT CURRENT_TIMESTAMP")
  .then((result) => {
    console.log("Database connection successful.");
    console.log("Current timestamp:", result.rows[0].current_timestamp);
  })
  .catch((error) => {
    console.error("Error connecting to the database:", error);
  });

db.select("*").from("users");

dotenv.config();

const app = express();

app.use(bodyParser.json());
app.use(cors());

//ROOT
app.get("/", (req, res) => {
  res.send("Server is running!!!");
});

//SignIn
app.post("/signin", (req, res) => {
  handleSignin(req, res, db, bcrypt);
});

//Register
app.post("/register", (req, res) => {
  handleRegister(req, res, db, bcrypt);
});

app.get("/profile/:id", (req, res) => {
  handleProfileGet(req, res, db);
});

app.put("/image", (req, res) => {
  handleImage(req, res, db);
});

app.post("/imageurl", (req, res) => {
  fetchImage(req, res);
});

const server = app.listen(port, () => {
  console.log(`Server is running on port ${server.address().port}`);
});
