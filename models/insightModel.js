const { formatDate } = require('../services/utility.js');
const db = require('../services/database.js').config;



// GET ALL INSIGHTS
let getInsights = () => new Promise((resolve, reject) => {
    let sql = "SELECT * FROM CCL2_insights INNER JOIN CCL2_artists ON CCL2_insights.artist = CCL2_artists.id ORDER BY CCL2_insights.date DESC";
    db.query(sql, function (err, insights) {
        if (err) {reject(err); return}

        insights.forEach(insight => {
            insight.text = insight.text.replaceAll('\n', '<br/>');
            insight.date = formatDate(insight.date);
        });

        resolve(insights);
    });
});


module.exports = {
    getInsights,
}