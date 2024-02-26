const express = require('express');
const router = express.Router();
const artistController = require('../controllers/artistController.js');
const authenticationService = require('../services/authentication.js');

const path = require('path');


// AUTHENTICATION BEFORE EVERY PAGE
router.use(authenticationService.authenticateJWT);



router.route('/')
    // gets artists from database and then shows artists page
    .get((req, res, next) => {
        artistController.getArtists(req, res, next);
    })
    


module.exports = router;

