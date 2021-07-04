const mongoose = require("mongoose");
const logger = require("./logger");

module.exports = () => {
  const db = process.env.DB;

  const mongoConnect = async () => {
    await mongoose.connect(db, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndModify: false,
      useCreateIndex: true,
    });
    logger.log("info", `Connected to mongoDB...`);
  };

  mongoConnect();
};
