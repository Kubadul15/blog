const express = require("express")
const sqlite3 = require("sqlite3")
const app = express()
const db = new sqlite3.Database("database.db")

app.set("view engine", "ejs")
app.get("/", (req,res) => {
    res.render("index")
})

app.listen(3000)