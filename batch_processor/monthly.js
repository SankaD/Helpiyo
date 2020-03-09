const calculateTopRequesterAllTime = require('./modules/badges/calculateTopRequesterAllTime');
const Logger = require('./modules/logger');

module.exports = () => {
    Logger.info("monthly cron job");
    // calculateTopRequesterAllTime();
};