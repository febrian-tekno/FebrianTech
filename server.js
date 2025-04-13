const express = require("express");
const fs = require("fs");
const favicon = require("serve-favicon");
const path = require("path");

process.env.NODE_ENV === "development"
  ? console.log("menjalankan mode development🚀⚡")
  : console.log("Mode production running✅");

const app = express();
const port = 80;

// set icon web
app.use(favicon(path.join(__dirname, "public", "favicon.ico")));

// gunakan ejs
app.set("view engine", "ejs");

// simpan file ejs dalam folder views(default)

app.get("/", (req, res) => {
  res.render("index", {
    nama: "putra febrian",
    title: "halaman utama putra febrian web",
  });
});

app.get("/about", (req, res) => {
  // mengembaliklan json
  res.render("about");
});

app.get("/contacts", (req, res) => {
  res.render("contacts");
});

app.get("/bookshelf", (req, res) => {
  res.render("book-shelf");
});
app.get("/movie-search", (req, res) => {
  res.render("movie-search");
});
app.get("/febrian-tech", (req, res) => {
  res.render("febrian-tech");
});
app.get("/blog/tutorial-mikrotik", (req, res) => {
  res.render("blog/tutorial-mikrotik");
});

app.get("/data/contacts", (req, res) => {
  // mengembaliklan file json
  res.sendFile("./data/user/contacts.json", { root: __dirname });
});
app.get("/api/user/:name", (req, res) => {
  const user = findContact(req.params.name);
  findContact("nana");
  // mengembaliklan json data contact spesific
  res.json(user);
});

app.delete("/", (req, res) => {
  res.send("hello world");
});

// menangkap parameter
// http://localhost/product/1?category=food
app.get("/product/:id", (req, res) => {
  res.send(
    `product dengan id: ${req.params.id} <br> category: ${req.query.category}`
  );
});

// akan selalu dijalankan dengan request apapun yang taidak terdefinisi atau di route  harus diletakan paling bawh
app.use("/assets", express.static(path.join(__dirname, "public", "assets")));

app.use("/", (req, res) => {
  res.status(404).render("error-404");
});

module.exports = app;

const findContact = (name) => {
  try {
    const data = fs.readFileSync("./data/user/contacts.json", "utf-8");
    const contacts = JSON.parse(data);
    if (name === "all") {
      return contacts;
    }
    const contact = contacts.find((kontak) => kontak.nama === name);
    if (!contact) {
      return { message: "user tidak ditemukan" };
    }
    return contact;
  } catch (err) {
    console.log(err.message);
    return null;
  }
};
findContact("nana");
