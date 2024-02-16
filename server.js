const express = require("express");
const bodyParser = require("body-parser");
const bcrypt = require("bcrypt");
const cors = require("cors");

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

//ROOT
app.get("/", (req, res) => {
  res.json(database.users);
});

//SignIn --> POST request = success or fail
app.post("/signin", (req, res) => {
  console.log("Request Body:", req.body.email);
  if (
    req.body.email === database.users[0].email &&
    req.body.password === database.users[0].password
  ) {
    //remove password
    res.json(database.users[0]);
  } else {
    res.status(400).json("error signin");
  }

  // const { email, password } = req.body;
  // const user = database.users.find((u) => u.email === email);
  // else if (!user) {
  //   res.status(400).json("Wrong username");
  //   return;
  // }
  // const isValid = await bcrypt.compare(password, user.password);
  // if (!isValid) {
  //   res.status(400).json("Wrong Password");
  //   return;
  // }
});

//Register --> POST request = will return new creator user
app.post("/register", async (req, res) => {
  const { id, email, name, password } = req.body;
  const hash = await bcrypt.hash(password, 10);
  database.users.push({
    id,
    email: email,
    name: name,
    password: hash,
    entries: 0,
    joined: new Date(),
  });
  console.log(database.users);
  res.json(database.users[database.users.length - 1]);
});

const findUserById = (id) => {
  return new Promise((resolve, reject) => {
    database.users.forEach((user) => {
      if (user.id === id) {
        resolve(user);
      }
    });
    reject("No such user");
  });
};
app.get("/profile/:id", (req, res) => {
  const { id } = req.params;
  findUserById(id)
    .then((user) => {
      res.json(user);
    })
    .catch((error) => {
      res.status(400).json(error);
    });
});

app.put("/image", (req, res) => {
  const { id } = req.body;
  findUserById(id)
    .then((user) => {
      user.entries++;
      res.json(user.entries);
    })
    .catch((error) => {
      res.status(400).json(error);
    });
});

const server = app.listen(1234, () => {
  console.log(`Server is running on port ${server.address().port}`);
});
