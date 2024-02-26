const express = require('express');
const router = express.Router();
const artworkController = require('../controllers/artworkController.js');
const authenticationService = require('../services/authentication.js');

const path = require('path');


// AUTHENTICATION BEFORE EVERY PAGE
router.use(authenticationService.authenticateJWT);



router.route('/')
    // gets artworks from database and then show artworks page
    .get((req, res, next) => {
        artworkController.getArtworks(req, res, next);
    })
    


module.exports = router;