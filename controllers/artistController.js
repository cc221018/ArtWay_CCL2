const artistModel = require('../models/artistModel.js');
const authenticationService = require('../services/authentication');
const imageUpload = require('../services/imageUpload.js');


// GET ALL ARTISTS
function getArtists(req, res, next) {
    artistModel.getArtists()
        .then((artists) => {
            res.render('artists', {artists})
        })
        .catch((err) => {
            res.sendStatus(500)
        })
}


// GET SINGLE ARTIST BY USERNAME
function getArtist(req,res,next) {
    let username = req.params.username;
    let myUsername = authenticationService.decodeJWT(req).username;
    let otherProfile = username !== myUsername;

    if (!username) {
        otherProfile = false;
        username = myUsername;
    }

    artistModel.getArtist(username)
        .then((artist) => {
            if (otherProfile) {
                res.render('artist', {artist})
            }
            else {
                res.render('profile', {artist})
            }
        })
        .catch((err) => {
            res.status(404);
            next(err);
        })
}


// GET TO EDIT PROFILE PAGE
function editArtist(req, res, next) {
    artistModel.getArtist(authenticationService.decodeJWT(req).id)
        .then((artist) => {
            res.render('edit', {artist})
        })
        .catch((err) => {
            res.sendStatus(500);
        })
}


// GET TO PROFILE PAGE AFTER EDIT
function updateArtist(req, res, next) {
    req.body.id = authenticationService.decodeJWT(req).id;
    artistModel.updateArtist(req.body)
        .then((artist) => {
            artistModel.getArtist(req.body.id)
                .then((artist) => {
                    res.render('profile', {artist})
                })
                .catch((err) => {
                    console.log(err);
                    res.sendStatus(500);
                })
        })
        .catch((err) => {
            console.log(err);
            res.sendStatus(500);
        })
}


// GET TO HOME PAGE AFTER REGISTERED
function registerArtist(req, res, next) {
    let artistData = req.body;
    if (artistData.profilepicture) {
        artistData.profilepicture = imageUpload.saveImage(req, res, next);
    } else {
        artistData.profilepicture = '';
    }
    artistModel.addArtist(artistData)
        .then((artist) => {
            artistModel.getArtistByLogin(artist.email, artist.password)
                .then((artist) => {
                    authenticationService.authenticateArtist(artist, res)
                    res.redirect('/');
                })
        })
        .catch((err) => {
            res.sendStatus(500);
        })
}


// GET TO LOGIN PAGE AFTER DELETED PROFILE
function deleteArtist(req, res) {
    artistModel.deleteArtist(req.artist.id)
    .then((artist) => {
        res.sendStatus(200);
    })
    .catch((err) => {
        console.log(err);
        res.sendStatus(500);
    })
}






module.exports = {
    getArtists,
    getArtist,
    editArtist,
    updateArtist,
    registerArtist,
    deleteArtist
}



