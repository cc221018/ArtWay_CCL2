require('dotenv').config();
const mysql = require('mysql');

const config = mysql.createConnection({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    multipleStatements: true
});


// (re-)connect to database / prevent database from going idle & breaking connection

config.connect(function(err) {
   if (err) {
    config.connect((err) => {
        console.log('Connection lost! Please try again later.', err);
    });
   }
   setInterval(() => {
    config.query('SELECT NOW();');
   }, 1000*60)
});


module.exports = {config};
