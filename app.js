const express = require("express");
const app = express();
const path = require("path");
const fs = require("fs");
const dataModel = require("./models/data");

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

app.post("/create", function (req, res) {
  fs.writeFile(
    `./files/${req.body.title.split(" ").join("")}.txt`,
    req.body.details,
    function (err) {
      res.redirect("/");
    }
  );
});

app.get("/profile/:username", function (req, res) {
  const u = req.params.username;
  res.send(`Hello ${u}`);
});

app.get("/edit/:filename", function (req, res) {
  fs.readFile(`./files/${req.params.filename}`, "utf-8", function (err) {
    res.render("editFileName", {
      filename: req.params.filename,
    });
  });
});

app.post("/edit", function (req, res) {
  fs.rename(
    `./files/${req.body.previousTitle}`,
    `./files/${req.body.newTitle}`,
    function (err) {
      res.redirect("/");
    }
  );
});

app.listen(3000, function () {
  console.log("its running!!");
});
