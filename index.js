const express = require("express")
const sqlite3 = require("sqlite3")
const app = express()
const db = new sqlite3.Database("database.db")

db.exec(`CREATE TABLE IF NOT EXISTS Users (
    id NUMBER,
    name TEXT
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

app.listen(3000)