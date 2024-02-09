const path = require('path');
const db = require("better-sqlite3")("database.db", {verbose: console.log});
const bcrypt = require("bcrypt");
const session = require("express-session");
const fileUpload = require("express-fileupload")
const fs = require("fs")



//Setter opp en rute som tar i mot login-skjemaet og logger inn brukeren om den finnes i databasen
async function login(req, res) {
        {
                //Lager en SQL-setning som henter ut data fra databasen når den kjøres. Spørsmålstegnene representerer verdier som skal hentes ut.
                const stmt = db.prepare("SELECT * FROM user WHERE brukernavn = ?");
                //Kjører SQL-setningen. Verdiene fra skjemaet settes inn på plassene til spørsmålstegnene. Det lagres et objekt med all informasjonen i variabelen user.
                const user = stmt.get(req.body.brukernavn);  
                  
                
            
                //Sjekker om brukeren finnes og sjekker deretter om hash av passordetm som er sendt inn matcher hashen lagret i databasen
                if (user && bcrypt.compareSync(req.body.passord, user.passord)) {
                    //Lagrer brukerinformasjonen i session
                    req.session.loggetInn = true;
                    req.session.brukernavn = user.brukernavn;
                    req.session.fornavn = user.fornavn;
                    req.session.etternavn = user.etternavn;
                    req.session.epost = user.epost;
                    req.session.fdato = user.fdato;
                    req.session.userid = user.id;
            
                    if (user.id === 1) {
                        req.session.admin = true;
                    }

                    console.log(req.session)
            
                    //Sender brukeren til velkommen.html om brukeren finnes og passordet er riktig
                //     res.cookie("brukernavn", user.brukernavn)
                //     res.cookie("fornavn", user.fornavn)
                //     res.cookie("etternavn", user.etternavn)
                //     res.cookie("epost", user.epost)
                //     res.cookie("fdato", user.fdato)
                //     res.cookie("userid", user.id)
                //     res.sendFile(path.join(__dirname, "private", "velkommen.html"))
                    res.sendStatus(200)

                } else {
                    //Sender brukeren til feil.html om ikke brukeren finnes eller passordet er feil
                    //res.sendFile(path.join(__dirname, "public", "feil.html"))
                    res.sendStatus(401)
                }
            }
}

//En rute som henter ut alle brukere fra databasen og sender dem tilbake som JSON

async function admin(req, res) {
        res.sendFile(path.join(__dirname, "private", "admin.html"))
}

async function loginaction  (req, res) {
        res.sendFile(path.join(__dirname, "public", "login.html"))        
}

async function loggut(req, res) {
        req.session.destroy();
        //res.redirect("/login");
        res.sendStatus(401)
}

async function nyttBilde(req, res) {
        res.sendFile(path.join(__dirname, "private", "nyttBilde.html"))
}

async function alleBilder(req, res) {
        res.sendFile(path.join(__dirname, "private", "bilder.html"))
}


exports.nyttBilde = nyttBilde;
exports.login = login;
exports.loginaction = loginaction;
exports.admin = admin;
exports.loggut = loggut;
exports.alleBilder = alleBilder;