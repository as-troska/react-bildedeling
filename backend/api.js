const express = require('express');
const path = require('path');
const db = require("better-sqlite3")("database.db", {verbose: console.log});
const bcrypt = require("bcrypt");
const session = require("express-session");
const fileUpload = require("express-fileupload")
const fs = require("fs");
const exp = require('constants');

//Setter opp en rute som kan ta imot et registreringsskjema som sendes inn via POST
async function registrer(req, res) {
    //Lager en SQL-setning som setter inn data i databasen når den kjøres. Spørsmålstegnene representerer verdier som skal settes inn.
    const stmt = db.prepare("INSERT INTO user (fornavn, etternavn, fdato, epost, brukernavn, passord) VALUES (?, ?, ?, ?, ?, ?)");
    //Hasher passordet som er sendt inn via skjemaet
    const hash = bcrypt.hashSync(req.body.passord, 10);    
    //Kjører SQL-setningen. Verdiene fra skjemaet settes inn på plassene til spørsmålstegnene.
    try {
        stmt.run(req.body.fornavn, req.body.etternavn, req.body.fdato, req.body.epost, req.body.brukernavn, hash);
    } catch (error) {
        console.log(error)
        return res.sendStatus(500)
    }
    
    //Sender brukeren til velkommen.html
    res.sendFile(path.join(__dirname, "private", "velkommen.html"))
}

async function slett(req, res) {
    // DELETE stamtment har syntaksen DELETE FROM tabell WHERE kolonne = verdi
    const stmt = db.prepare("DELETE FROM user WHERE id = ?");
    stmt.run(req.params.id);
    //Sender brukeren tilbake til siden de kom fra, dvs skjemaet de var på.
    res.redirect("back")
}

async function kommenter(req, res) {
    console.log(req.body)
    const stmt = db.prepare("INSERT INTO comments (comment, user_id, photo_id) VALUES (?, ?, ?)")
    stmt.run(req.body.kommentar, req.session.userid, req.body.bildeid)
    res.sendStatus(200)
}

//En rute for å oppdatere en bruker
async function oppdatere (req, res) {
    console.log(req.body)
    // UPDATE stamtment har syntaksen UPDATE tabell SET kolonne = verdi, kontonne = verdi WHERE kolonne = verdi
    const stmt = db.prepare("UPDATE user SET fornavn = ?, etternavn = ?, fdato = ?, epost = ?, brukernavn = ? WHERE id = ?");
    stmt.run(req.body.fornavn, req.body.etternavn, req.body.fdato, req.body.epost, req.body.brukernavn, req.body.id);
    //Sender brukeren tilbake til siden de kom fra, dvs skjemaet de var på.
    res.sendStatus(200);
}

async function lastopp(req, res) {    
    const filetypes = ["image/jpg", "image/png", "image/gif", "image/jpeg"]
    
    if(!req.files) {
        return res.sendStatus(400)
    }

    if(filetypes.includes(req.files.bilde.mimetype)) {
        req.files.bilde.mv(__dirname + "/public/img/" + req.files.bilde.name)
        console.log("File uploaded: " + req.files.bilde.name)
        const stmt = db.prepare("INSERT INTO photos (url, caption, user_id) VALUES (?, ?, ?)")
        stmt.run("img/" + req.files.bilde.name, req.body.caption, req.session.userid)
        return res.sendStatus(200)        
    } else {
        return res.sendStatus(415)
    }

}

async function liked(req, res) {
    const stmt = db.prepare("SELECT * FROM likes WHERE photo_id = ? AND user_id = ?")
    const liked = stmt.get(req.params.id, req.session.userid)

    if(liked) {
        res.json({liked: true})
    } else {
        res.json({liked: false})
    }
}

async function likes(req, res) {
    const stmt = db.prepare("SELECT user.brukernavn FROM likes INNER JOIN user ON likes.user_id = user.id WHERE photo_id = ? ")
    const likes = stmt.all(req.params.id)
    res.json(likes)
}

async function like(req, res) {
    const stmt = db.prepare("INSERT INTO likes (photo_id, user_id) VALUES (?, ?)")
    stmt.run(req.params.id, req.session.userid)
    res.sendStatus(200)
}

async function brukere (req, res) { 
    const stmt = db.prepare("SELECT * FROM user");
    const users = stmt.all();
    res.json(users)
}

async function bilder(req, res) {
    const stmt = db.prepare("SELECT photos.id, photos.url, photos.caption, photos.user_id, user.brukernavn FROM photos INNER JOIN user ON photos.user_id = user.id")
    const photos = stmt.all()
    res.json(photos)   
}

async function kommentarer(req, res) {
    const stmt = db.prepare("SELECT comments.user_id, comments.photo_id, brukernavn, comment FROM comments INNER JOIN user ON comments.user_id = user.id INNER JOIN photos ON comments.photo_id = photos.id WHERE photos.id = ?")
    const comments = stmt.all(req.params.id)
    res.json(comments)
}

async function loggetinn(req, res) {
    console.log(req.session.loggetInn)
    if(req.session.loggetInn) {
        res.sendStatus(200)
    } else {
        res.sendStatus(401) 
    }
}

exports.slett = slett;
exports.kommenter = kommenter;
exports.registrer = registrer;
exports.oppdatere = oppdatere;
exports.lastopp = lastopp;
exports.brukere = brukere;
exports.bilder = bilder;
exports.kommentarer = kommentarer;
exports.liked = liked;
exports.likes = likes;
exports.like = like;
exports.loggetinn = loggetinn;