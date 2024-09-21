const express = require("express");
const app = express();
const path = require("path");
const Data = require("./models/data");
require("dotenv").config();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));
app.set("view engine", "ejs");

app.get("/", async function (req, res) {
  try {
    const documents = await Data.find({}, "title");
    const files = documents.map((doc) => doc.title);
    console.log(documents); // Add this to debug the output
    res.render("index", { files: files });
  } catch (err) {
    console.error("Error fetching files from MongoDB:", err); // Check the error logs
    res.status(500).send("Failed to retrieve files from MongoDB.");
  }
});

// file operations are here
app.get("/files/:filename", async function (req, res) {
  try {
    // Find the document in MongoDB using the title (which includes ".txt")
    const document = await Data.findOne({ title: req.params.filename });

    if (!document) {
      return res.status(404).send("File not found in MongoDB.");
    }

    // Render the data from MongoDB
    res.render("show", {
      filename: document.title, // Use the title from the MongoDB document
      filedata: document.content, // Use the content from the MongoDB document
    });
  } catch (err) {
    console.error("Error reading data from MongoDB:", err);
    res.status(500).send("Failed to retrieve file from MongoDB.");
  }
});

app.post("/create", async function (req, res) {
  try {
    // Create a new instance of the Data model
    let fileName = `${req.body.title.trim()}.txt`;
    const newData = new Data({
      title: fileName,
      content: req.body.details,
    });

    // Save the data to MongoDB (returns a promise)
    await newData.save();
    res.redirect("/");
  } catch (err) {
    console.error("Error:", err);
    res.status(500).send("Failed to save data or create file.");
  }
});

app.get("/edit/:filename", function (req, res) {
  res.render("editFileName", {
    filename: req.params.filename,
  });
});

app.post("/edit", async function (req, res) {
  const previousTitle = req.body.previousTitle.trim();
  const newTitle = `${req.body.newTitle.trim()}`;

  // Validate that the new title is not empty
  if (!newTitle) {
    return res.status(400).send("New file name is required.");
  }
  // Update the title in MongoDB
  try {
    const result = await Data.findOneAndUpdate(
      { title: previousTitle }, // Find by the old title
      { title: `${newTitle}.txt` }, // Update to the new title
      { new: true } // Return the updated document
    );

    if (!result) {
      return res.status(404).send("Document not found in MongoDB.");
    }

    console.log("Document updated in MongoDB:", result.content);
    res.redirect("/"); // Redirect after successful update
  } catch (dbError) {
    console.error("Error updating MongoDB:", dbError);
    res.status(500).send("Failed to update document in MongoDB.");
  }
});

app.get("/delete/:filename", function (req, res) {
  res.render("delete", {
    filename: req.params.filename,
  });
});

app.post("/delete", async function (req, res) {
  const titleToDelete = req.body.title; // req.body.title is now accessible

  try {
    // First, delete the document from MongoDB
    const result = await Data.deleteOne({ title: titleToDelete });

    if (result.deletedCount === 0) {
      return res
        .status(404)
        .send("No document found with the specified title.");
    }

    console.log(`Document with title "${titleToDelete}" deleted from MongoDB.`);
    res.redirect("/");
  } catch (err) {
    console.error("Error deleting document from MongoDB:", err);
    res.status(500).send("Failed to delete document.");
  }
});

app.listen(process.env.PORT || 8000, function () {
  console.log("its running!!");
});
