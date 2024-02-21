//Register --> POST request = will return new creator user
const handleRegister = async (req, res, db, bcrypt) => {
  const { id, email, name, password } = req.body;
  const hash = await bcrypt.hash(password, 10);

  db.transaction((trx) => {
    trx
      .insert({
        hash: hash,
        email: email,
      })
      .into("login")
      .returning("email")
      .then((loginEmail) => {
        return trx("users")
          .returning("*")
          .insert({
            email: loginEmail[0].email,
            name: name,
            entries: 0,
            joined: new Date(),
          })
          .then((user) => {
            res.json(user[0]);
          });
      })
      .then(trx.commit)
      .catch(trx.rollback);
  }).catch((error) => {
    res.status(400).json("Error, user already exist");
  });
};

module.exports = {
  handleRegister: handleRegister,
};
