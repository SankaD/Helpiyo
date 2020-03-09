// process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

const express = require('express');
const app = express();
const https = require('https');
const DbManager = require('./modules/db/db_manager');
const CronJob = require('cron').CronJob;

const minutely = require('./minutely');
const hourly = require('./hourly');
const daily = require('./daily');
const monthly = require('./monthly');

const rankings = require('./modules/rankings/calculate');

DbManager.init();
// const PORT = 12000;
// app.listen(PORT, () => {
//     console.log("listening on port : " + PORT);
// });

const job0 = new CronJob("0 0 0 */1 * *", () => {
    daily();
});
job0.start();

const job2 = new CronJob("0 0 0 1 */1 *", () => {
    monthly();
});
job2.start();

const job3 = new CronJob("0 0 */1 * * *", () => {
    hourly()
});
job3.start();

const job4 = new CronJob("0 */1 * * * *", () => {
    minutely()
});
job4.start();
const job5 = new CronJob("*/1 * * * * *", () => {

});
job5.start();