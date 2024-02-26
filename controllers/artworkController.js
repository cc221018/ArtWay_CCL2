const artworkModel = require('../models/artworkModel.js');
const authenticationService = require('../services/authentication');
const imageUpload = require('../services/imageUpload.js');


// GET ALL ARTWORKS
function getArtworks(req, res, next) {
    artworkModel.getArtworks()
        .then((artworks) => {
            res.render('artworks', {artworks})
        })
        .catch((err) => {
            res.sendStatus(500)
        })
}


module.exports = {
    getArtworks
}