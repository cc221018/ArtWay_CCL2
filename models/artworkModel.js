const db = require('../services/database.js').config;
const { formatDate } = require('../services/utility.js');


// GET ALL ARTWORKS
let getArtworks = () => new Promise((resolve, reject) => {
    let sql = "SELECT * FROM CCL2_artworks INNER JOIN CCL2_artists ON CCL2_artworks.artist = CCL2_artists.id ORDER BY CCL2_artworks.date DESC";
    db.query(sql, function (err, artworks) {
        if (err) {reject(err); return}

        artworks.forEach(artwork => {
            artwork.date = formatDate(artwork.date);
        });

        resolve(artworks);
    });
});


module.exports = {
    getArtworks,
}