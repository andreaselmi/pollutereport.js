require("dotenv").config({ path: `.env.${process.env.NODE_ENV}` });
const express = require("express");
const helmet = require("helmet");
const app = express();
const users = require("./routes/users");
require("./db")();

app.use(express.json());
app.use(helmet());
app.use("/users", users);

app.get("/", (req, res) => {
  res.status(200).send("This is the homepage");
  console.log(process.env.NODE_ENV);
});

const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`Server is listening on port ${port}.....`);
});
