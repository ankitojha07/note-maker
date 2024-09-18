const mongoose = require("mongoose");

mongoose
  .connect(`mongodb://127.0.0.1:27017/note-maker`, {})
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => {
    console.error("Failed to connect to MongoDB:", err);
  });

const userSchema = mongoose.Schema({
  name: String,
  username: String,
  email: String,
});

module.exports = mongoose.model("user", userSchema);
