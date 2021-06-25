require("dotenv").config();
const express = require("express");
const app = express();

app.get("/", (req, res) => {
  res.status(200).send("This is the homepage");
});

const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`Server is listening on port ${port}.....`);
});
