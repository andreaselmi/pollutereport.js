const mongoose = require("mongoose");

module.exports = () => {
  const db = process.env.DB;

  const mongoConnect = async () => {
    try {
      await mongoose.connect(db, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify: false,
        useCreateIndex: true,
      });
      console.log(`Connected to mongoDB...`);
    } catch (error) {
      console.log("Failed to connect to mongodb", error);
    }
  };

  mongoConnect();
};
