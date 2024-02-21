const hadleImage = (req, res, db) => {
  const { id } = req.body;
  db("users")
    .where("id", "=", id)
    .increment("entries", 1)
    .returning("entries")
    .then((entries) => {
      res.json(entries[0].entries);
    })
    .catch((error) => {
      res.status(400).json("Error, unable to count entries");
    });
};

module.exports = {
  hadleImage: hadleImage,
};
