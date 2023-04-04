const express = require("express")
const sqlite3 = require("sqlite3")
const app = express()
const db = new sqlite3.Database("database.db")

db.exec(`CREATE TABLE IF NOT EXISTS Users (
    id NUMBER AUTO_INCREMENT not null,
    name TEXT not null,
    password TEXT not null
);
CREATE TABLE IF NOT EXISTS Posts (
    id NUMBER AUTO_INCREMENT not null,
    author TEXT not null,
    title TEXT not null,
    content TEXT not null

);`)
app.set("view engine", "ejs")
app.get("/", (req,res) => {
    res.render("index")
})

app.get("/users", (req,res) => {
    res.render("users")
})

app.get("/posts", (req,res) => {
    res.render("posts")
})

app.listen(3000, () =>console.log("Aplikacja działa na porcie 3000"))