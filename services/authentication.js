const jwt = require('jsonwebtoken');
const ACCESS_TOKEN_SECRET=process.env.ACCESS_TOKEN_SECRET;
const bcrypt = require('bcrypt');


// generate access token & set cookie

async function authenticateArtist(artist, res) {
    const accessToken = jwt.sign({ id: artist.id, username: artist.username}, ACCESS_TOKEN_SECRET, { expiresIn: 50000 });
    res.cookie('accessToken', accessToken);
}


// decode jwt token

function decodeJWT(req) {
    const token = req.cookies['accessToken'];
    if(!token) return;

    return jwt.decode(token);
}


// check & authenticate jwt token

function authenticateJWT(req, res, next) {
    const token = req.cookies['accessToken'];
    if (token) {
        jwt.verify(token, ACCESS_TOKEN_SECRET, (err, artist) => {
            if (err) {
                return res.sendStatus(403);
            }
            req.artist = artist;
            next();
        });
    } else {
        res.sendStatus(401);
    }
}


// check if user is logged in & if access token was set

function isLoggedIn(req) {
    let loginState = false;
    const token = req.cookies['accessToken'];
    if (token) {
        jwt.verify(token, ACCESS_TOKEN_SECRET, (err, artist) => {
            if (err) {
                loginState = false;
                return loginState;
            }
            loginState = true;
            return loginState;
        });
    }
    return loginState;
}


module.exports = {
    authenticateArtist,
    authenticateJWT,
    decodeJWT,
    isLoggedIn
}
