const express = require("express")
const sqlite3 = require("sqlite3")
const app = express()
const db = new sqlite3.Database("database.db")
const pin = 2137
db.exec(`
CREATE TABLE IF NOT EXISTS Posts (
    id INTEGER  PRIMARY KEY,
    author TEXT not null,
    title TEXT not null,
    content TEXT not null

);`)


app.set("view engine", "ejs")
app.use(express.urlencoded({extended: false}))

app.get("/", (req,res) => {
    const posts = db.all(`SELECT * FROM Posts ORDER BY id DESC`, (err, rows) =>{
        if(err){
            console.log(err)
        }
        res.render("index", {posts: rows})
    })
})

app.get("/newpost", (req,res) => {
    res.render("newpost")
})

app.get("/error/pin", (req,res) =>{
    res.render("errorpin")
})
app.post("/newpost/submit", (req,res) =>{
    if(req.body.pin != pin){
        res.redirect("/error/pin")
    }else{
    const author = req.body.author
    const title = req.body.title
    const content = req.body.content
    db.all(`INSERT INTO Posts(author, title, content)
    VALUES('${author}', '${title}', '${content}');`)
    res.redirect("/")
    }})


app.listen(3000, () =>console.log("Aplikacja działa na porcie 3000"))