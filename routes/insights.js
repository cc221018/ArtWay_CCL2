const express = require('express');
const router = express.Router();
const insightController = require('../controllers/insightController.js');
const authenticationService = require('../services/authentication.js');

const path = require('path');


// AUTHENTICATION BEFORE EVERY PAGE
router.use(authenticationService.authenticateJWT);



router.route('/')
    // gets insights from database and then show insights page
    .get((req, res, next) => {
        insightController.getInsights(req, res, next);
    })
    


module.exports = router;
