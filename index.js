const express = require("express")
const sqlite3 = require("sqlite3")
const app = express()
const db = new sqlite3.Database("database.db")
const md5 = require("md5")
const port = process.env.PORT || 3000
db.exec(`
CREATE TABLE IF NOT EXISTS Users (
id INTEGER PRIMARY KEY,
username TEXT not null,
password TEXT not null
);

CREATE TABLE IF NOT EXISTS Posts (
    id INTEGER  PRIMARY KEY,
    author TEXT not null,
    title TEXT not null,
    content LONGTEXT not null

);`)


app.set("view engine", "ejs")
app.use(express.urlencoded({extended: false}))
app.use(express.static('public'))
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

app.post("/newpost/submit", (req,res) =>{
    const username = req.body.username
    const password = md5(req.body.password)
    const title = req.body.title
    const content = req.body.content
    db.all(`SELECT * From Users WHERE username = '${username}' AND password = '${password}';`, (err,rows) =>{
        if(rows.length === 0){
            res.redirect("/error/Wpisano niepoprawne dane logowania")
        }else{
        db.all(`INSERT INTO Posts(author, title, content)
        VALUES('${username}', '${title}', '${content}');`)
        res.redirect("/")
        }
    })
})

    app.get("/install", (req, res) => {
        db.all(`SELECT * FROM Users`, (err,rows) =>{
            if(err || rows.length != 0){
                res.redirect("/")
            }else{
                res.render("install")
            }
        })
    })
    app.post("/install/submit", (req,res) =>{
        db.all(`SELECT * FROM Users`, (err,rows) =>{
            if(err || rows.length != 0){
                res.redirect("/")
            }else{
        const username = req.body.username
        const password = md5(req.body.password)
        db.all(`INSERT INTO Users(username, password) VALUES ('${username}', '${password}')`, (err) =>{
            if(err){
                res.redirect("/error/Nie udało się utworzyć konta administratora, spróbuj ponownie")
            }else{
                res.redirect(`/info/Utworzono administratora ${username}`)
            }
            })
        }})
    })

    app.get("/info/:code", (req,res) =>{
        res.render("info", {code: req.params.code})
    })

app.listen(port, () =>console.log("Aplikacja działa na porcie 3000"))
