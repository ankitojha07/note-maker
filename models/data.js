const mongoose = require("mongoose");
require("dotenv").config();

mongoose
  .connect(process.env.MONGO_URL, {})
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => {
    console.error("Failed to connect to MongoDB:", err);
  });

const dataSchema = mongoose.Schema({
  title: String,
  content: String,
});

const Data = mongoose.model("Data", dataSchema);
module.exports = Data;
