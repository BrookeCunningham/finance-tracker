// import controller functions
const { getInsights } = require('../controllers/insightController.js');

const insightRouter = require('express').Router();

insightRouter.get('/insights', getInsights);

modules.exports = insightRouter;