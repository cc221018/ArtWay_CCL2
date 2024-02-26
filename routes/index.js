const express = require('express');
const router = express.Router();
const artistModel = require('../models/artistModel');
const artistController = require("../controllers/artistController");
const authenticationService = require('../services/authentication');



router.route('/')
    // shows home page (if user is logged in)
    .get((req, res, next) => {
        if (authenticationService.isLoggedIn(req)) {
            res.render('home');
        } else {
            res.render('login');
        }
    })


router.route('/login')
    // shows login page
    .get((req, res, next) => {
        res.render('login');
    })
    // check if credentials are correct
    .post((req, res, next) => {
        artistModel.getArtistByLogin(req.body.email, req.body.password)
            .then((artist) => {
                authenticationService.authenticateArtist(artist, res)
                res.redirect('/');
            })
            .catch((err) => {
                res.send('e-mail or password incorrect');
            })
    });


router.route('/logout')
    // shows login page and resets accessToken
    .get((req, res, next) => {
        res.cookie('accessToken', '', {maxAge: 0});
        res.redirect('/login');
    })


router.route('/register')
    // shows register page
    .get((req, res, next) => {
        res.render('register');
    })
    // adds artist to database & redirects to home page
    .post((req, res, next) => {
        artistController.registerArtist(req, res, next);
    })


    
module.exports = router;


