const mongoose = require("mongoose");

module.exports = () => {
  const db = process.env.DB;
  const mongoConnect = async () => {
    await mongoose.connect(db, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndModify: false,
      useCreateIndex: true,
    });
    console.log(`Connected to ${db}...`);
  };

  mongoConnect();
};
