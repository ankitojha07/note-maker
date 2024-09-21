const mongoose = require("mongoose");
require("dotenv").config(); // Ensure you have a .env file with DB_PASSWORD

// MongoDB Atlas connection URI, with password fetched from .env
const uri = `mongodb+srv://notemaker:${process.env.DB_PASSWORD}@note-maker.elcy0.mongodb.net/note-maker?retryWrites=true&w=majority`;

// Connect to MongoDB using Mongoose
mongoose
  .connect(uri, {
    useNewUrlParser: true, // Optional: parses connection string according to the new spec
    useUnifiedTopology: true, // Optional: enables the new unified topology engine
  })
  .then(() => {
    console.log("Connected to MongoDB Atlas successfully!");
  })
  .catch((err) => {
    console.error("Failed to connect to MongoDB:", err);
  });

// Define your schema and model
const dataSchema = mongoose.Schema({
  title: String,
  content: String,
});

const Data = mongoose.model("Data", dataSchema);

module.exports = Data;
