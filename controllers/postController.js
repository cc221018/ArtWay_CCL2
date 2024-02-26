const postModel = require('../models/postModel.js');
const authenticationService = require('../services/authentication');
const imageUpload = require('../services/imageUpload.js');



// ADD insight entry to database
function addInsight(req, res, next) {
    let insightData = req.body;
    insightData.artist = req.artist.id;
    postModel.addInsight(insightData)
        .then((insight) => {
            res.redirect('/profile');
        })
        .catch((err) => {
            res.sendStatus(500);
            console.log(err);
        })
}

// ADD artwork entry to database
function addArtwork(req, res, next) {
    let artworkData = req.body;
    artworkData.artist = req.artist.id;
    artworkData.imagepath = imageUpload.saveImage(req, 'artworks');
    postModel.addArtwork(artworkData)
        .then((artwork) => {
            res.redirect('/profile');
        })
        .catch((err) => {
            res.sendStatus(500);
            console.log(err);
        })
}

// DELETE artwork entry from database
function deleteArtwork(req, res) {
    postModel.deleteArtwork(req)
        .then((imagepath) => {
            imageUpload.deleteImagefs(imagepath, "artworks");
            res.sendStatus(200);
        })
        .catch((err) => {
            res.sendStatus(500);
            console.log(err);
        })
}

// DELETE insight entry from database
function deleteInsight(req, res) {
    postModel.deleteInsight(req)
        .then(() => {
            res.sendStatus(200);
        })
        .catch((err) => {
            res.sendStatus(500);
            console.log(err);
        })
}




module.exports = {
    addArtwork,
    addInsight,
    deleteArtwork,
    deleteInsight
}