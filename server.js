const express = require("express");
const bodyParser = require("body-parser");
const bcrypt = require("bcrypt");
const cors = require("cors");

const saltRounds = 10;
const myPlaintextPassword = "s0//P4$$w0rD";
const someOtherPlaintextPassword = "not_bacon";

const app = express();

const database = {
  users: [
    {
      id: "123",
      name: "Asaf",
      email: "Asaf@gmail.com",
      password: "blabla",
      entries: 0,
      joined: new Date(),
    },
    {
      id: "321",
      name: "sally",
      email: "sally@gmail.com",
      password: "banana",
      entries: 0,
      joined: new Date(),
    },
  ],
};

app.use(bodyParser.json());
app.use(cors());

app.get("/", (req, res) => {
  res.send(database.users);
});

app.post("/signin", (req, res) => {
  bcrypt.compare(
    "Apple",
    "$2b$10$VM0xMaWO9TOxE57r1OtUguCoKHVJ1JjYu0MXQ9ncPBhc66Tjf2FtW",
    function (err, result) {
      console.log("first guess", res);
    }
  );
  bcrypt.compare(
    "apple",
    "$2b$10$VM0xMaWO9TOxE57r1OtUguCoKHVJ1JjYu0MXQ9ncPBhc66Tjf2FtW",
    function (err, result) {
      console.log("second guess", res);
    }
  );
  if (
    req.body.email === database.users[0].email &&
    req.body.password === database.users[0].password
  ) {
    res.json("Success");
  } else {
    res.status(400).json("error signin");
  }
});

app.post("/register", (req, res) => {
  const { email, name, password } = req.body;
  bcrypt.hash(myPlaintextPassword, saltRounds, function (err, hash) {
    // Store hash in your password DB.
    console.log(hash);
  });
  database.users.push({
    id: "125",
    name: name,
    email: email,
    password: password,
    entries: 0,
    joined: new Date(),
  });
  res.json(database.users[database.users.length - 1]);
});

const findUserById = (id, callback) => {
  let found = false;
  database.users.forEach((user) => {
    if (user.id === id) {
      found = true;
      callback(user);
    }
  });
  return found;
};

app.get("/profile/:id", (req, res) => {
  const { id } = req.params;
  const found = findUserById(id, (user) => {
    res.json(user);
  });
  if (!found) {
    res.status(400).json("No such user");
  }
});

app.put("/image", (req, res) => {
  const { id } = req.body;
  const found = findUserById(id, (user) => {
    user.entries++;
    res.json(user.entries);
  });
  if (!found) {
    res.status(400).json("No such user");
  }
});

app.listen(1234, () => {
  console.log("running in 1234");
});
