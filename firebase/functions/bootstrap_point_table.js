process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

const configs = require('./.runtimeconfig');

const PointTable = require('./modules/models/point_table');
const Point = require('./modules/models/point');
const moment = require('moment');
const mongoose = require('mongoose');

let now = moment().utc().toDate();
let point = null;

function create() {
    const db = mongoose.connection;
    db.on("error", (error) => {
        console.error(error);
    });
    db.once("open", () => {
        console.log("mongodb connection opened");
    });
    mongoose.connect(configs.db.mongo_url, {
        useNewUrlParser: true,
        dbName: "helpiyo",
        keepAlive: true,
        socketTimeoutMS: 540000
    });

    Point.updateMany({type: "early-adopter"}, {value: 1000000}).exec()
    // .then(results => {
    //     console.log("entry count : " + results.length);
    //
    //     return Promise.all(promises);
    // })
        .then(() => {
            console.log("finished");
        })
        .catch(error => {
            console.error(error);
        });

    // Promise.resolve()
    //     .then(() => {
    //         console.log("starting...");
    //         point = new PointTable({
    //             type: "demote-service",
    //             value: -10,
    //             createdOn: now,
    //         });
    //
    //         return point.save();
    //     })
    //     .then(() => {
    //         console.log("ending...");
    //     })
    //     .catch(error => {
    //         console.error(error);
    //     });
}

create();