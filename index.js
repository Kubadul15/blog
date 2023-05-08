const express = require("express")
const sqlite3 = require("sqlite3")
const app = express()
const db = new sqlite3.Database("database.db")
const md5 = require("md5")
const cookiesession = require("cookie-session")
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
app.use(cookiesession({
    name: 'session',
    secret: 'ASdasdoiashjnf9u28hr7832hr(*HCN*(&AQW&Ebnf',
    maxAge: 2 * 60 * 60 * 1000 // po 2h automatycznie wylogowywuje
  }))

app.get("/", (req,res) => {
    const posts = db.all(`SELECT * FROM Posts ORDER BY id DESC`, (err, rows) =>{
        if(err){
            console.log(err)
        }
        res.render("index", {posts: rows, session: req.session})
    })
})

app.get("/login", (req,res) =>{
    if(!req.session.logged){
        res.render("login.ejs", {session: req.session})
    }
})

app.post("/login/submit", (req,res) =>{
    if(!req.session.logged){
        const username = req.body.username
        const password = md5(req.body.password)
        db.all(`SELECT * From Users WHERE username = '${username}' AND password = '${password}';`, (err,rows) =>{
            if(rows.length === 0){
                res.redirect("/error/Wpisano niepoprawne dane logowania")
            }else{
                req.session.logged = true
                req.session.username = username
                res.redirect("/")
            }
        })
    }
})
app.get("/logout", (req,res) =>{
    req.session.logged = false 
    req.session.username = false
    res.redirect("/")
})
app.get("/newpost", (req,res) => {
    if(!req.session.logged){
        res.redirect("/login")
    }else{
    res.render("newpost", {session: req.session})
    }
})

app.post("/newpost/submit", (req,res) =>{
    if(!req.session.logged){
        res.redirect("/login")
    }else{
        const title = req.body.title
        const content = req.body.content
        const username = req.session.username
        db.all(`INSERT INTO Posts(author, title, content)
        VALUES('${username}', '${title}', '${content}');`)
        res.redirect("/")
        }})

    app.get("/install", (req, res) => {
        db.all(`SELECT * FROM Users`, (err,rows) =>{
            if(err || rows.length != 0){
                res.redirect("/")
            }else{
                res.render("install", {session: req.session})
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
    app.get("/delete", (req,res) =>{
        if(!req.session.logged){
            res.redirect("/login")
        }else{
            res.render("delete", {session: req.session})
        }
    })
    app.post("/delete/submit", (req,res) =>{
        if(!req.session.logged){
            res.redirect("/login")
        }else{
        const id = req.body.id
        db.all(`DELETE FROM Posts WHERE id='${id}'`)
        res.redirect("/")
    }})
 
    app.get("/addadmin", (req,res) =>{
        if(!req.session.logged){
            res.redirect("/login")
        }else{
            res.render("addadmin", {session: req.session})
        }
    })
    app.post("/addadmin/submit", (req,res) =>{
        if(!req.session.logged){
            res.redirect("/login")
        }else{
            const username = req.body.username
            const password = md5(req.body.password)
            db.all(`INSERT INTO Users(username, password) VALUES ('${username}', '${password}')`)
            res.redirect("/")
        }
    })
    app.get("/cleardatabase/:type", (req, res) =>{
        if(!req.session.logged){
            res.redirect("/login")
        }else{
            const type = req.params.type
            if(type == "posts"){
                db.all(`DELETE FROM Posts`)
                res.redirect("/")
            }else if(type == "users"){
                db.all(`DELETE FROM Users`)
                res.redirect("/logout")
            }else{
                res.redirect("/")
            }
        }
    })
    app.get("/info/:code", (req,res) =>{
        res.render("info", {code: req.params.code, session: req.session})
    })

app.listen(port, () =>console.log(`Aplikacja działa na porcie ${port}`))
