const express = require("express");
const app = express();
const path = require("path");
const fs = require("fs");
const Data = require("./models/data");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));
app.set("view engine", "ejs");

app.get("/", function (req, res) {
  console.log("App is running");

  fs.readdir(`./files`, function (err, files) {
    res.render("index", { files: files });
  });
});

// file operations are here
app.get("/files/:filename", function (req, res) {
  fs.readFile(
    `./files/${req.params.filename}`,
    "utf-8",
    function (err, filedata) {
      res.render("show", {
        filename: req.params.filename,
        filedata: filedata,
      });
    }
  );
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

    // Create a file after saving the data to MongoDB
    fs.writeFile(
      `./files/${req.body.title.split(" ").join("")}.txt`,
      req.body.details,
      function (err) {
        if (err) {
          console.error("Error writing file:", err);
          return res.status(500).send("Failed to create file.");
        }
        res.redirect("/");
      }
    );
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

  try {
    // Check if the file exists in the filesystem
    const oldFilePath = `./files/${previousTitle}`;
    const newFilePath = `./files/${newTitle.split(" ").join("")}.txt`;

    console.log(previousTitle);

    // Check if the old file exists
    fs.access(oldFilePath, fs.constants.F_OK, async (err) => {
      if (err) {
        console.error("File not found:", previousTitle);
        return res.status(404).send("File not found.");
      }

      // Rename the file on the filesystem
      fs.rename(oldFilePath, newFilePath, async (err) => {
        if (err) {
          console.error("Error renaming file:", err);
          return res.status(500).send("Failed to rename file.");
        }

        // Update the title in MongoDB
        try {
          const result = await Data.findOneAndUpdate(
            { title: previousTitle }, // Find by the old title
            { title: newTitle }, // Update to the new title
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
    });
  } catch (err) {
    console.error("Error:", err);
    res.status(500).send("Failed to update file.");
  }
});

app.listen(3000, function () {
  console.log("its running!!");
});
