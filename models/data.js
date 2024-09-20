const mongoose = require("mongoose");

mongoose
  .connect(`mongodb://127.0.0.1:27017/note-maker`, {})
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
