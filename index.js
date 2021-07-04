require("express-async-errors");
//TODO verificare dotenv
require("dotenv").config({ path: `.env.${process.env.NODE_ENV}` });
const express = require("express");
const helmet = require("helmet");
const app = express();
const users = require("./routes/users");
const auth = require("./routes/auth");
const posts = require("./routes/posts");
const token = require("./routes/token");
require("./helpers/db")();
const cors = require("cors");
const error = require("./middleware/error");
const logger = require("./helpers/logger");

app.use(cors());
app.use(express.json());
app.use(helmet());
app.use("/users", users);
app.use("/auth", auth);
app.use("/posts", posts);
app.use("/token", token);
app.use(error);

process.on("unhandledRejection", (err) => {
  throw err;
});

if (!process.env.ACCESS_TOKEN_SECRET && !process.env.REFRESH_TOKEN_SECRET) {
  throw new Error(
    "FATAL ERROR: jwt keys for access token and refresh token are not defined."
  );
}

const port = process.env.PORT || 5000;
app.listen(port, () => {
  logger.log("info", `Server is listening on port ${port}.....`);
});
