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
    res.render("index", { files: documents });
  } catch (err) {
    console.error("Error fetching files from MongoDB:", err);
    res.status(500).send("Failed to retrieve files from database.");
  }
});

// File operations
app.get("/files/:filename", async function (req, res) {
  try {
    const document = await Data.findOne({ title: req.params.filename });

    if (!document) {
      return res.status(404).send("File not found in database.");
    }

    res.render("show", {
      filename: document.title,
      filedata: document.content,
    });
  } catch (err) {
    console.error("Error reading data from MongoDB:", err);
    res.status(500).send("Failed to retrieve file from database.");
  }
});

app.post("/create", async function (req, res) {
  try {
    let fileName = `${req.body.title.trim()}.txt`;
    const existingFile = await Data.findOne({ title: fileName });
    if (existingFile) {
      return res.status(400).send("File with this title already exists.");
    }

    const newData = new Data({
      title: fileName,
      content: req.body.details,
    });

    await newData.save();
    res.redirect("/");
  } catch (err) {
    console.error("Error:", err);
    res.status(500).send("Failed to save data or create file.");
  }
});

app.get("/edit/:filename", async function (req, res) {
  try {
    const file = await Data.findOne({ title: req.params.filename });

    if (!file) {
      return res.status(404).send("File not found.");
    }

    res.render("editFileName", {
      file,
    });
  } catch (error) {
    console.error("Error fetching file:", error);
    res.status(500).send("Server error while fetching file.");
  }
});

app.post("/edit", async function (req, res) {
  const previousTitle = req.body.previousTitle.trim();
  const newTitle = req.body.newTitle.trim() + ".txt";
  const newContent = req.body.content;

  if (!newTitle) {
    return res.status(400).send("New file name is required.");
  }

  if (previousTitle === newTitle && !newContent) {
    return res.status(400).send("No changes made.");
  }

  try {
    const result = await Data.findOneAndUpdate(
      { title: previousTitle },
      { title: newTitle, content: newContent },
      { new: true }
    );

    if (!result) {
      return res.status(404).send("Document not found in database.");
    }

    res.redirect("/");
  } catch (dbError) {
    console.error("Error updating MongoDB:", dbError);
    res.status(500).send("Failed to update document in database.");
  }
});

app.get("/delete/:filename", function (req, res) {
  res.render("delete", {
    filename: req.params.filename,
  });
});

app.post("/delete", async function (req, res) {
  const titleToDelete = req.body.title;

  try {
    const result = await Data.deleteOne({ title: titleToDelete });

    if (result.deletedCount === 0) {
      return res
        .status(404)
        .send("No document found with the specified title.");
    }

    console.log(
      `Document with title "${titleToDelete}" deleted from database.`
    );
    res.redirect("/");
  } catch (err) {
    console.error("Error deleting document from database:", err);
    res.status(500).send("Failed to delete document.");
  }
});

app.listen(process.env.PORT || 8000, function () {
  console.log("Server is running!");
});
