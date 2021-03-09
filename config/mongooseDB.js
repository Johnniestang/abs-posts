const mongoose = require("mongoose");
const config = require("config");
const database = config.get("db.connection");

const conn = async () => {
  try {
    console.log("Connecting to db ...");
    await mongoose.connect(database, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });

    console.log("DB connection made");
  } catch (err) {
    console.log("DB Connection failed: ", err.message);
    // console.error(err.message);
    process.exit(1);
  }
};

module.exports = conn;
