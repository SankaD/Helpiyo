// const moment = require('moment');
//
// module.exports = (url, user, password, dbName) => {
//     const db = new arangodb.Database({
//         url: url
//     });
//     db.useBasicAuth(user, password);
//     console.log("connected to database for truncating");
//     return Promise.resolve()
//         .then(() => {
//             return db.useDatabase(dbName);
//         })
//         .then(() => {
//             return db.collection("Profile").truncate();
//         })
//         .then(() => {
//             return db.collection("Badge").truncate();
//         })
//         .then(() => {
//             return db.collection("Class").truncate();
//         })
//         .then(() => {
//             return db.collection('Device').truncate();
//         })
//         .then(() => {
//             return db.collection("Message").truncate();
//         })
//         .then(() => {
//             return db.collection("MessageThread").truncate();
//         })
//         .then(() => {
//             return db.collection("Request").truncate();
//         })
//         .then(() => {
//             return db.collection("Response").truncate();
//         })
//         .then(() => {
//             return db.collection("Service").truncate();
//         })
//         .then(() => {
//             return db.collection("Tag").truncate();
//         })
//         .then(() => {
//             return db.collection("Feedback").truncate();
//         })
//         .then(() => {
//             return db.edgeCollection("awards").truncate();
//         })
//         .then(() => {
//             return db.edgeCollection("classed_at").truncate();
//         })
//         .then(() => {
//             return db.edgeCollection("comments").truncate();
//         })
//         .then(() => {
//             return db.edgeCollection("follows").truncate();
//         })
//         .then(() => {
//             return db.edgeCollection("hosts").truncate();
//         })
//         .then(() => {
//             return db.edgeCollection("message_for").truncate();
//         })
//         .then(() => {
//             return db.edgeCollection("message_in").truncate();
//         })
//         .then(() => {
//             return db.edgeCollection("message_with").truncate();
//         })
//         .then(() => {
//             return db.edgeCollection("notifies").truncate();
//         })
//         .then(() => {
//             return db.edgeCollection("promotes").truncate();
//         })
//         .then(() => {
//             return db.edgeCollection("provides").truncate();
//         })
//         .then(() => {
//             return db.edgeCollection("rates_request").truncate();
//         })
//         .then(() => {
//             return db.edgeCollection("rates_response").truncate();
//         })
//         .then(() => {
//             return db.edgeCollection("reports").truncate();
//         })
//         .then(() => {
//             return db.edgeCollection("requests_with").truncate();
//         })
//         .then(() => {
//             return db.edgeCollection("responds_to").truncate();
//         })
//         .then(() => {
//             return db.edgeCollection("responds_with").truncate();
//         })
//         .then(() => {
//             return db.edgeCollection("serves").truncate();
//         })
//         .then(() => {
//             return db.edgeCollection("signs_in").truncate();
//         })
//         .then(() => {
//             return db.edgeCollection("threaded_in").truncate();
//         })
//         .then(() => {
//             return db.edgeCollection("tagged_with").truncate();
//         })
//         .then(() => {
//             const action = String(params => {
//                 const db = require('@arangodb').db;
//                 [
//                     {
//                         _key: "X",
//                         label: "X",
//                         ratio: 10 // per 1 billion
//                     },
//                     {
//                         _key: "S",
//                         label: "S",
//                         ratio: 100
//                     },
//                     {
//                         _key: "A",
//                         label: "A",
//                         ratio: 10000
//                     },
//                     {
//                         _key: "B",
//                         label: "B",
//                         ratio: 100000
//                     },
//                     {
//                         _key: "C",
//                         label: "C",
//                         ratio: 1000000
//                     },
//                     {
//                         _key: "N",
//                         label: "N",
//                         ratio: 1000000000
//                     }
//                 ].forEach(element => {
//                     let result = db.Class.save(element);
//                 });
//             });
//
//             return db.transaction({
//                 write: ["Class"],
//                 read: []
//             }, action, {});
//         });
// };
