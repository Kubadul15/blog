const express = require("express")
const sqlite3 = require("sqlite3")
const app = express()
const db = new sqlite3.Database("database.db")

db.exec(`CREATE TABLE IF NOT EXISTS Users (
    id INTEGER  PRIMARY KEY,
    name TEXT not null,
    password TEXT not null
);
CREATE TABLE IF NOT EXISTS Posts (
    id INTEGER  PRIMARY KEY,
    author TEXT not null,
    title TEXT not null,
    content TEXT not null

);`)


app.set("view engine", "ejs")
app.use(express.urlencoded({extended: false}))

app.get("/", (req,res) => {
    const posts = db.all(`SELECT * FROM Posts`, (err, rows) =>{
        if(err){
            console.log(err)
        }
        res.render("index", {posts: rows})
    })
})

app.get("/newpost", (req,res) => {
    res.render("newpost")
})

app.post("/newpost/submit", (req,res) =>{
    const author = req.body.author
    const title = req.body.title
    const content = req.body.content
    db.all(`INSERT INTO Posts(author, title, content)
    VALUES('${author}', '${title}', '${content}');`)
    res.redirect("/")
})

app.listen(3000, () =>console.log("Aplikacja działa na porcie 3000"))