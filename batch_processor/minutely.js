const calculateTopRequesterAllTime = require('./modules/badges/calculateTopRequesterAllTime');
const rankings = require('./modules/rankings/calculate');
const Logger = require('./modules/logger');
module.exports = () => {
    Logger.info("minutely cron job");
    // calculateTopRequesterAllTime();
    // rankings();
};