const db = require('../services/database.js').config;


// CREATE NEW DATABASE ENTRY FOR NEW INSIGHT
let addInsight = (insightData) => new Promise( async (resolve, reject) => {
    let sql = "INSERT INTO CCL2_insights(title, text, date, artist) VALUES( " +
        db.escape(insightData.title) + "," +
        db.escape(insightData.text) + "," +
        "NOW()" + "," +
        db.escape(insightData.artist) + ")";

    db.query(sql, function(err, res) {
        if (err) {
            reject(err);
        }
        resolve(insightData);
    })
});


// CREATE NEW DATABASE ENTRY FOR NEW ARTWORK
let addArtwork = (artworkData) => new Promise( async (resolve, reject) => {
    let sql = "INSERT INTO CCL2_artworks(imagepath, artist, date) VALUES( " +
        db.escape(artworkData.imagepath) + "," +
        db.escape(artworkData.artist) + "," +
        "NOW()" + ")";

    db.query(sql, function(err, res) {
        if (err) {
            reject(err);
        }
        resolve(artworkData);
    })
});


// DELETE DATABASE ENTRY FOR INSIGHT BY ID
let deleteInsight = (req) => new Promise ((resolve, reject) => {
    let sql = `DELETE FROM CCL2_insights WHERE CCL2_insights.id='${req.params.id}' AND CCL2_insights.artist='${req.artist.id}'`;

    db.query(sql, function(err) {
        if (err) {
            reject(err);
        }
        resolve();
    })
})

// DELETE DATABASE ENTRY FOR ARTWORK BY ID
let deleteArtwork = (req) => new Promise ((resolve, reject) => {
    let sql = `SELECT imagepath FROM CCL2_artworks WHERE CCL2_artworks.id='${req.params.id}' AND CCL2_artworks.artist='${req.artist.id}'`;

    db.query(sql, function(err, imagepath) {
        if (err) {
            reject(err);
        }
        sql = `DELETE FROM CCL2_artworks WHERE CCL2_artworks.id='${req.params.id}' AND CCL2_artworks.artist='${req.artist.id}'`;
        db.query(sql, function(err) {
            if (err) {
                reject(err);
            }
            resolve(imagepath[0].imagepath);
        })
    })
})


module.exports = {
    addArtwork,
    addInsight,
    deleteArtwork,
    deleteInsight
}