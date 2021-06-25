require("dotenv").config({ path: `.env.${process.env.NODE_ENV}` });
const express = require("express");
const app = express();

require("./db")();

app.get("/", (req, res) => {
  res.status(200).send("This is the homepage");
  console.log(process.env.NODE_ENV);
});

const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`Server is listening on port ${port}.....`);
});
