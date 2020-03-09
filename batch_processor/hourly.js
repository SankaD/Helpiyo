const calculateTopRequesterAllTime = require('./modules/badges/calculateTopRequesterAllTime');
const Logger = require('./modules/logger');
const rankings = require('./modules/rankings/calculate');
module.exports = () => {
    Logger.info("hourly cron job");
    // calculateTopRequesterAllTime();
    rankings();

};
