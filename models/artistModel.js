const db = require('../services/database.js').config;
const bcrypt = require('bcrypt');
const { formatDate } = require('../services/utility.js');
const { deleteImagefs } = require('../services/imageUpload.js');


// GET ALL ARTISTS
let getArtists = () => new Promise((resolve, reject) => {
    let sql = "SELECT * FROM CCL2_artists";
    db.query(sql, function (err, artists) {
        if (err) {reject(err); return}

        artists.forEach(artist => {
            if (!artist.profilepicture || artist.profilepicture === '') {
                artist.profilepicture = '../../contents/profilepic_placeholder.jpg';
            }
        })

        resolve(artists);
    });
});


// GET SINGLE ARTIST BY ID OR USERNAME
let getArtist = (id) => new Promise((resolve, reject) => {
    let sql = `SELECT * FROM CCL2_artists WHERE CCL2_artists.id='${id}' OR CCL2_artists.username='${id}'`;
    db.query(sql, function (err, artist) {
        if (err || !artist || artist.length===0) {reject(err); return;}

        artist = artist[0];
        /*
        *   username = asd
        *   id = 1
        *   insights = [1, 2, 3, 4]
        *   artworks = [5, 6, 7, 8]
        */

        if (!artist.profilepicture || artist.profilepicture === '') {
            artist.profilepicture = '../../contents/profilepic_placeholder.jpg';
        }

        sql = `SELECT * FROM CCL2_insights WHERE CCL2_insights.artist='${artist.id}'`;
        db.query(sql, (err, insights) => {
            if(err) {reject(err); return;}
            artist.insights = insights;

            sql = `SELECT * FROM CCL2_artworks WHERE CCL2_artworks.artist='${artist.id}'`;
            db.query(sql, (err, artworks) => {
                artist.artworks = artworks;

                artist.insights.forEach(insight => {
                    insight.text = insight.text.replaceAll('\n', '<br/>');
                    insight.date = formatDate(insight.date);
                });

                artist.artworks.forEach(artwork => {
                    artwork.date = formatDate(artwork.date);
                });

                resolve(artist);
            });
        });
    });
});


// TERNARY OP: if password is set, put into string; otherwise put empty string
// "asd" + (password !== '') ? password : '' + "def"

// UPDATE DATABASE ENTRY FOR SINGLE ARTIST BY ID
let updateArtist = (artistData) => new Promise( async (resolve, reject) => {
    let sql = "UPDATE CCL2_artists SET " +
        "firstname = " + db.escape(artistData.firstname) +
        ", lastname = " + db.escape(artistData.lastname) +
        ", username = " + db.escape(artistData.username) +
        ", email = " + db.escape(artistData.email) +
        ", country = " + db.escape(artistData.country) +
        ", phonenumber = " + db.escape(artistData.phonenumber) +
        ", description = " + db.escape(artistData.description);
        
        if(artistData.profilepicture && artistData.profilepicture !== '') {
            sql += ", profilepicture = " + db.escape(artistData.profilepicture);
        }    

        if(artistData.password && artistData.password !== '') {
            artistData.password = await bcrypt.hash(artistData.password, 10);
            sql += ", password = " + db.escape(artistData.password);
        }
        
        sql += "WHERE id = " + parseInt(artistData.id);

    db.query(sql, function(err) {
        if (err) {
            reject(err);
            return;
        }
        resolve(artistData);
    })
});


// CREATE NEW DATABASE ENTRY FOR NEW ARTIST
let addArtist = (artistData) => new Promise( async (resolve, reject) => {
    artistData.hpassword = await bcrypt.hash(artistData.password, 10);
    let sql = "INSERT INTO CCL2_artists(firstname, lastname, username, email, country, profilepicture, phonenumber, description, password) VALUES( " +
        db.escape(artistData.firstname) + "," +
        db.escape(artistData.lastname) + "," +
        db.escape(artistData.username) + "," +
        db.escape(artistData.email) + "," +
        db.escape(artistData.country) + "," +
        db.escape(artistData.profilepicture) + "," +
        db.escape(artistData.phonenumber) + "," +
        db.escape(artistData.description) + "," +
        db.escape(artistData.hpassword) + ")";

    db.query(sql, function(err, res) {
        if (err) {
            reject(err);
        }
        resolve(artistData);
    })
});


// DELETE DATABASE ENTRY FOR ARTIST BY ID
let deleteArtist = (id) => new Promise ((resolve, reject) => {
    let sql = `SELECT imagepath FROM CCL2_artworks WHERE CCL2_artworks.artist='${id}';`;
    db.query(sql, (err, filenames) => {
        if (err) {
            reject(err);
            return;
        }
        filenames.forEach(filename => {
            deleteImagefs(filename.imagepath, 'artworks');
        })

        sql = `DELETE FROM CCL2_insights WHERE CCL2_insights.artist='${id}';` +
              `DELETE FROM CCL2_artworks WHERE CCL2_artworks.artist='${id}';` +
              `DELETE FROM CCL2_artists WHERE id='${id}';`;

        db.query(sql, function(err) {
            if (err) {
                reject(err);
                return;
            }
            resolve(id);
        })
    })
})


// GET SINGLE ARTIST BY USERNAME & PASSWORD FOR LOGIN
let getArtistByLogin = (email, password) => new Promise((resolve, reject) => {
    let sql = `SELECT * FROM CCL2_artists WHERE email='${email}'`;
    db.query(sql, async function (err, artist) {
        if (err || !artist || artist.length === 0) {reject(err); return}
        if(await bcrypt.compare(password, artist[0].password)) {
            resolve(artist[0]);
        } else {
            reject(err);
        }
    })
})



module.exports = {
    getArtists,
    getArtist,
    updateArtist,
    addArtist,
    deleteArtist,
    getArtistByLogin
}
