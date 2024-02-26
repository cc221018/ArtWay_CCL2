const express = require('express');
const router = express.Router();
const artistController = require('../controllers/artistController.js');
const authenticationService = require('../services/authentication.js');
const imageUpload = require('../services/imageUpload.js');

// AUTHENTICATION BEFORE EVERY PAGE
router.use(authenticationService.authenticateJWT);


router.route('/')
    // shows own profile
    .get((req, res, next) => {
        artistController.getArtist(req, res, next);
    })
    // shows profile after edit
    .post((req, res, next) => {
        artistController.updateArtist(req, res, next);
    })


router.route('/:username')
    // shows other artist's profile depending on username
    .get((req, res, next) => {
        artistController.getArtist(req, res, next);
    })

router.route('/edit')
    // shows edit profile page
    .get((req, res, next) => {
        artistController.editArtist(req, res, next);
    })
    // changes/adds data in/to database
    .post((req, res) => {
        req.body.profilepicture = imageUpload.saveImage(req, 'profilepics');
        artistController.updateArtist(req, res);
    })

router.route('/delete')
    // deletes profile and then shows login page or deletes profile picture
    .delete((req, res, next) => {
        if (req.body.toDelete === 'profile') {
            artistController.deleteArtist(req, res, next);
        }
        else if (req.body.toDelete === 'profilepic') {
            imageUpload.deleteImage(req)
                .then(() => {
                    res.sendStatus(200);
                })
                .catch((err) => {
                    console.log(err);
                })
        }
    })


module.exports = router;