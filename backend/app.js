//Importerer pakkene vi skal bruke
const express = require('express');
const path = require('path');
const db = require("better-sqlite3")("database.db", {verbose: console.log});
const bcrypt = require("bcrypt");
const session = require("express-session");
const fileUpload = require("express-fileupload")
const fs = require("fs")
const ruter = require("./ruter")
const api = require("./api")
const cors = require("cors");



//Lager en instans av Express i variabelen app
const app = express();

app.use(cors({
    origin: "http://localhost:5173",
    credentials: true
}));

//Setter opp en mappe for statiske filer
app.use(express.static(path.join(__dirname, "public")));
app.use(fileUpload({
    defCharset: 'utf8',
    defParamCharset: 'utf8'}
))

//Gjør at vi kan lese data fra et skjema som sendes inn via POST
app.use(express.urlencoded({ extended: false }));

//Setter opp sessions
app.use(session({
    secret: "secretSomBørLagresIEnMiljøvariabel",
    resave: false,
    saveUninitialized: false,
    sameSite: "lax",
    cookie: {
        secure: false
    }
}));


app.post("/login", ruter.login);
app.get("/admin", sjekkAdmin, ruter.admin)
app.get("/login", ruter.loginaction)
app.get("/loggut", ruter.loggut)
app.get("/nyttBilde", sjekkLogin, ruter.nyttBilde)
app.get("/alleBilder", sjekkLogin, ruter.alleBilder)


app.post("/kommenter", sjekkLogin, api.kommenter)
app.post("/registrer", api.registrer);
app.post("/lastOpp", sjekkLogin, api.lastopp);
app.get("/bilder", sjekkLogin, api.bilder)
app.get("/brukere", sjekkAdmin, api.brukere);
app.post("/oppdatere", sjekkAdmin, api.oppdatere)
app.get("/slett/:id", sjekkAdmin, api.slett)
app.get("/kommentarer/:id", sjekkLogin, api.kommentarer)
app.post("/like/:id", sjekkLogin, api.like)
app.get("/likes/:id", sjekkLogin, api.likes)
app.get("/liked/:id", sjekkLogin, api.liked)

app.get("/", (req, res) => {
    res.redirect("/login")  
})




//Starter sørveren på port 3000
app.listen(3000, () => {
    console.log('Server is running on port 3000');
})



//En middleware som sjekker om brukeren er logget inn. Om ikke sender den brukeren til innloggingssiden.
function sjekkLogin(req, res, next) {
    
    console.log(req.session.loggetInn)
    if (req.session.loggetInn) {
        next();
    } else {
        //res.redirect("/login");
        res.sendStatus(401);
    }
}

function sjekkAdmin(req, res, next) {
    console.log(req.session.loggetInn)
    if (req.session.admin) {
        next();
    } else {
        //res.redirect("/login");
        res.sendStatus(401);
    }
}
