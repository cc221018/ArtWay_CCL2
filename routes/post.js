const express = require('express');
const router = express.Router();
const postController = require('../controllers/postController.js');
const authenticationService = require('../services/authentication');

// AUTHENTICATION BEFORE EVERY PAGE
router.use(authenticationService.authenticateJWT);


router.route('/')
    // shows post page
    .get((req, res, next) => {
        res.render('post');
    });

router.route('/artwork')
    // adds artwork to database & then redirects to profile
    .post((req, res) => {
        postController.addArtwork(req, res)
    });

router.route('/insight')
    // adds insight to database & then redirects to profile
    .post((req, res) => {
        postController.addInsight(req, res)
    });

router.route('/artwork/:id')
    // deletes artwork from database
    .delete((req, res) => {
        postController.deleteArtwork(req, res)
    });

router.route('/insight/:id')
    // deletes insight from database
    .delete((req, res) => {
        postController.deleteInsight(req, res)
    });



module.exports = router;