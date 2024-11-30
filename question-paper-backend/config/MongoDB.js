const mongoose = require("mongoose");
require("dotenv").config();

const mongoDB = () => {
  // MongoDB connection
  mongoose
    .connect(process.env.MONGO_URI, {})
    .then(() => console.log("MongoDB connected"))
    .catch((err) => console.error("MongoDB connection error:", err));
};

module.exports = mongoDB;
