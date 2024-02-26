const insightModel = require('../models/insightModel.js');
const authenticationService = require('../services/authentication');


// GET ALL INSIGHTS
function getInsights(req, res, next) {
    insightModel.getInsights()
        .then((insights) => {
            res.render('insights', {insights})
        })
        .catch((err) => {
            res.sendStatus(500)
        })
}



module.exports = {
    getInsights
}