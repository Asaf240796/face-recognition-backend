import dotenv from "dotenv";
dotenv.config();
// Load environment variables from .env file

const returnClarifiRequestOptions = (imageUrl) => {
  const API_KEY = process.env.REACT_APP_API_KEY;
  const PAT = API_KEY;
  const USER_ID = "35h1h6xbhrmp";
  const APP_ID = "test";
  const IMAGE_URL = imageUrl;

  const raw = JSON.stringify({
    user_app_id: {
      user_id: USER_ID,
      app_id: APP_ID,
    },
    inputs: [
      {
        data: {
          image: {
            url: IMAGE_URL,
          },
        },
      },
    ],
  });

  const requestOptions = {
    method: "POST",
    headers: {
      Accept: "application/json",
      Authorization: "Key " + PAT,
    },
    body: raw,
  };

  return requestOptions;
};

export const fetchImage = (req, res) => {
  const { input } = req.body;
  process.env["NODE_TLS_REJECT_UNAUTHORIZED"] = 0;
  fetch(
    "https://api.clarifai.com/v2/models/face-detection/outputs",
    returnClarifiRequestOptions(input)
  )
    .then((response) => response.json())
    .then((result) => {
      res.json(result);
    })
    .catch((err) => {
      res.status(500).json("bad request");
    });
};

export const handleImage = (req, res, db) => {
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
