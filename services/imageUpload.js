const { v4: uuidv4 } = require('uuid');
const db = require('../services/database.js').config;
const fs = require('fs');
const { log } = require('console');



// save image of any kind (profile picture or artwork) in folder

function saveImage(req, path) {
    if (!req.files) return null;

    deleteImage(req);

    const image = req.files.pic;
    const ext = '.' + image.name.split('.').pop().toLowerCase();
    let filename = uuidv4();
    let uploadPath = __dirname + '/../public/uploads/' + path + '/' + filename + ext;
    image.mv(uploadPath);

    return filename + ext;
}

// DELETE file from folder

function deleteImagefs(name, path) {
    return new Promise((resolve, reject) => {
        fs.unlink(__dirname + "/../public/uploads/" + path + "/" + name, (err) => {
            if(err) {reject(err); return;}
            resolve();
        });
    });
}


// DELETE profile picture

function deleteImage(req) {
    return new Promise ((resolve, reject) => {
        let sql = `SELECT profilepicture FROM CCL2_artists WHERE CCL2_artists.username='${req.artist.username}'`;
        db.query(sql, function (err, profilepic) {
            if (err) {reject(err); return}
            profilepic = profilepic[0];

            if(profilepic.profilepicture) {
                deleteImagefs(profilepic.profilepicture, "profilepics")
                    .then(() => {
                        sql = `UPDATE CCL2_artists SET profilepicture = NULL WHERE CCL2_artists.username='${req.artist.username}'`;
                        db.query(sql, (err) => {
                            if(err) {reject(err); return}
                            resolve();
                        })
                    })
                    .catch((err) => {
                        reject(err);
                    });
            }
        });
    })
}



module.exports = {
    saveImage,
    deleteImage,
    deleteImagefs
}
