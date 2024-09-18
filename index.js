const express = require("express");
const app = express();
const path = require("path");
const fs = require("fs");
const userModel = require("./usermodel");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));
app.set("view engine", "ejs");

app.get("/", function (req, res) {
  fs.readdir(`./files`, function (err, files) {
    res.render("index", { files: files });
  });
});

// database operations here

app.get("/create", async (req, res) => {
  let createdUser = await userModel.create({
    name: "Ankit Ojha",
    email: "ankitojha9648@gmail.com",
    username: "ankitojha07",
  });

  res.send(createdUser);
});

app.get("/update", async (req, res) => {
  let updatedUser = await userModel.findOneAndUpdate(
    {
      username: "ankitojha07",
    },
    {
      name: "Samuel",
      email: "test@leena.ai",
    }
  );

  res.send(updatedUser);
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
