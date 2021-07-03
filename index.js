require("dotenv").config({ path: `.env.${process.env.NODE_ENV}` });
const express = require("express");
const helmet = require("helmet");
const app = express();
const users = require("./routes/users");
const auth = require("./routes/auth");
const posts = require("./routes/posts");
const tokens = require("./routes/tokens");
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
app.use("/token", tokens);
app.use(error);

process.on("unhandledRejection", (err) => {
  logger.error(err);
  process.exit(1);
});

process.on("uncaughtException", (err) => {
  logger.error(err);
  process.exit(1);
});

if (!process.env.ACCESS_TOKEN_SECRET && !process.env.REFRESH_TOKEN_SECRET) {
  throw new Error(
    "FATAL ERROR: jwt keys for access token and refresh token are not defined."
  );
}

const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`Server is listening on port ${port}.....`);
});
