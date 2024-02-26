
// AQUIRE NODE MODULES ETC

const port = 3000;
const path = require('path');
const db = require('./services/database');

const express = require('express');
const app = express();

const ejs = require('ejs');
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(express.static(__dirname + '/public'));

const cors = require('cors');
app.use(cors());

app.use(express.urlencoded({extended: true}));
app.use(express.json());

const fileupload = require('express-fileupload');
app.use(fileupload({createParentPath: true}));

const cookieParser = require('cookie-parser');
app.use(cookieParser());


// ROUTERS

const indexRouter = require('./routes/index');
app.use('/', indexRouter);

const artistsRouter = require('./routes/artists');
app.use('/artists', artistsRouter);

const artworksRouter = require("./routes/artworks");
app.use("/artworks", artworksRouter)

const insightsRouter = require("./routes/insights");
app.use("/insights", insightsRouter)

const profileRouter = require("./routes/profile");
const { log } = require('console');
app.use("/profile", profileRouter)

const postRouter = require("./routes/post");
app.use("/post", postRouter)



function errorHandler(err, req, res, next) {
    console.log(err);
    res.render('error', { error: err });
}
app.use(errorHandler);


// START APP

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}/login`);
});










// INSIGHT CONTENT from:
// https://www.gamesindustry.biz/how-to-get-a-job-in-game-art
// https://www.theartpostblog.com/en/how-to-get-started-in-the-art-industry-tips-for-finding-the-perfect-job-for-an-artist/
// https://www.quora.com/What-are-some-advice-to-get-into-the-concept-art-industry
// https://brushwarriors.com/art-challenges/

// main background picture: https://www.wallpaperflare.com/minimalist-minimalism-landscape-planet-colorful-illustration-wallpaper-bxifo

// ARTIWORKS & ARTISTS:
// all artists and their artworks are real and can be found on eg. artstation.com or instagram
// EXCEPTIONS: dummy data (made up users with fake test data)
//             test users (eg friends of mine who tested the website, the data/pictures belongs to them)
//             the made up persona (Sum Ting Wong), the artworks on her page are made by me