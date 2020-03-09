// const moment = require('moment');
//
// module.exports = (url, user, password, dbName) => {
//     const db = new arangodb.Database({
//         url: url
//     });
//     db.useBasicAuth(user, password);
//     console.log("connected to database for bootstrapping");
//     return Promise.resolve()
//     // return db.dropDatabase(dbName)
//     //     .catch(error => {
//     //         console.error(error.message);
//     //     })
//     //     .then(() => {
//     //         return db.createDatabase(dbName);
//     //     })
//         .then(() => {
//             return db.useDatabase(dbName);
//         })
//         .then(() => {
//             return db.collection("Profile").create({waitForSync: false, numberOfShards: 2, replicationFactor: 3});
//         })
//         .then(() => {
//             return db.collection("Badge").create({waitForSync: false, numberOfShards: 2, replicationFactor: 3});
//         })
//         .then(() => {
//             return db.collection("Class").create({waitForSync: false, numberOfShards: 2, replicationFactor: 3});
//         })
//         .then(() => {
//             return db.collection('Device').create({waitForSync: false, numberOfShards: 2, replicationFactor: 3});
//         })
//         .then(() => {
//             return db.collection("Device").createGeoIndex(["latitude", "longitude"]);
//         })
//         .then(() => {
//             return db.collection("Message").create({waitForSync: false, numberOfShards: 2, replicationFactor: 3});
//         })
//         .then(() => {
//             return db.collection("MessageThread").create({waitForSync: false, numberOfShards: 2, replicationFactor: 3});
//         })
//         .then(() => {
//             return db.collection("Request").create({waitForSync: false, numberOfShards: 2, replicationFactor: 3});
//         })
//         .then(() => {
//             return db.collection("Request").createGeoIndex(["latitude", "longitude"]);
//         })
//         .then(() => {
//             return db.collection("Response").create({waitForSync: false, numberOfShards: 2, replicationFactor: 3});
//         })
//         .then(() => {
//             return db.collection("Response").createGeoIndex(["latitude", "longitude"]);
//         })
//         .then(() => {
//             return db.collection("Service").create({waitForSync: false, numberOfShards: 2, replicationFactor: 3});
//         })
//         .then(() => {
//             return db.collection("Tag").create({waitForSync: false, numberOfShards: 2, replicationFactor: 3});
//         })
//         .then(() => {
//             return db.collection("Feedback").create({waitForSync: false, numberOfShards: 2, replicationFactor: 3});
//         })
//         .then(() => {
//             return db.edgeCollection("awards").create({waitForSync: false, numberOfShards: 2, replicationFactor: 3});
//         })
//         .then(() => {
//             return db.edgeCollection("classed_at").create({
//                 waitForSync: false,
//                 numberOfShards: 2,
//                 replicationFactor: 3
//             });
//         })
//         .then(() => {
//             return db.edgeCollection("comments").create({waitForSync: false, numberOfShards: 2, replicationFactor: 3});
//         })
//         .then(() => {
//             return db.edgeCollection("follows").create({waitForSync: false, numberOfShards: 2, replicationFactor: 3});
//         })
//         .then(() => {
//             return db.edgeCollection("hosts").create({waitForSync: false, numberOfShards: 2, replicationFactor: 3});
//         })
//         .then(() => {
//             return db.edgeCollection("message_for").create({
//                 waitForSync: false,
//                 numberOfShards: 2,
//                 replicationFactor: 3
//             });
//         })
//         .then(() => {
//             return db.edgeCollection("message_in").create({
//                 waitForSync: false,
//                 numberOfShards: 2,
//                 replicationFactor: 3
//             });
//         })
//         .then(() => {
//             return db.edgeCollection("message_with").create({
//                 waitForSync: false,
//                 numberOfShards: 2,
//                 replicationFactor: 3
//             });
//         })
//         .then(() => {
//             return db.edgeCollection("notifies").create({waitForSync: false, numberOfShards: 2, replicationFactor: 3});
//         })
//         .then(() => {
//             return db.edgeCollection("promotes").create({waitForSync: false, numberOfShards: 2, replicationFactor: 3});
//         })
//         .then(() => {
//             return db.edgeCollection("provides").create({waitForSync: false, numberOfShards: 2, replicationFactor: 3});
//         })
//         .then(() => {
//             return db.edgeCollection("rates_request").create({
//                 waitForSync: false,
//                 numberOfShards: 2,
//                 replicationFactor: 3
//             });
//         })
//         .then(() => {
//             return db.edgeCollection("rates_response").create({
//                 waitForSync: false,
//                 numberOfShards: 2,
//                 replicationFactor: 3
//             });
//         })
//         .then(() => {
//             return db.edgeCollection("reports").create({waitForSync: false, numberOfShards: 2, replicationFactor: 3});
//         })
//         .then(() => {
//             return db.edgeCollection("requests_with").create({
//                 waitForSync: false,
//                 numberOfShards: 2,
//                 replicationFactor: 3
//             });
//         })
//         .then(() => {
//             return db.edgeCollection("responds_to").create({
//                 waitForSync: false,
//                 numberOfShards: 2,
//                 replicationFactor: 3
//             });
//         })
//         .then(() => {
//             return db.edgeCollection("responds_with").create({
//                 waitForSync: false,
//                 numberOfShards: 2,
//                 replicationFactor: 3
//             });
//         })
//         .then(() => {
//             return db.edgeCollection("serves").create({waitForSync: false, numberOfShards: 2, replicationFactor: 3});
//         })
//         .then(() => {
//             return db.edgeCollection("signs_in").create({
//                 waitForSync: false,
//                 numberOfShards: 2,
//                 replicationFactor: 3
//             });
//         })
//         .then(() => {
//             return db.edgeCollection("threaded_in").create({
//                 waitForSync: false,
//                 numberOfShards: 2,
//                 replicationFactor: 3
//             });
//         })
//         .then(() => {
//             return db.edgeCollection("tagged_with").create({
//                 waitForSync: false,
//                 numberOfShards: 2,
//                 replicationFactor: 3
//             });
//         })
//         .then(() => {
//             const graph = db.graph("main");
//             return graph.create({
//                 edgeDefinitions: [
//                     {
//                         collection: "awards",
//                         from: ["Badge"],
//                         to: ["Profile"]
//                     },
//                     {
//                         collection: "comments",
//                         from: ["Profile"],
//                         to: ["Response", "Request"]
//                     },
//                     {
//                         collection: "follows",
//                         from: ["Profile"],
//                         to: ["Profile"]
//                     },
//                     {
//                         collection: "message_for",
//                         from: ["MessageThread"],
//                         to: ["Request"]
//                     },
//                     {
//                         collection: "message_in",
//                         from: ["Profile"],
//                         to: ["MessageThread"]
//                     },
//                     {
//                         collection: "message_with",
//                         from: ["Profile"],
//                         to: ["Message"]
//                     },
//                     {
//                         collection: "rates_request",
//                         from: ["Profile"],
//                         to: ["Request"]
//                     },
//                     {
//                         collection: "rates_response",
//                         from: ["Profile"],
//                         to: ["Response"]
//                     },
//                     {
//                         collection: "reports",
//                         from: ["Profile"],
//                         to: ["Request", "Response", "Profile", "MessageThread", "Message"]
//                     },
//                     {
//                         collection: "requests_with",
//                         from: ["Profile"],
//                         to: ["Request"]
//                     },
//                     {
//                         collection: "responds_to",
//                         from: ["Response"],
//                         to: ["Request"]
//                     },
//                     {
//                         collection: "responds_with",
//                         from: ["Profile"],
//                         to: ["Response"]
//                     },
//                     {
//                         collection: "threaded_in",
//                         from: ["Message"],
//                         to: ["MessageThread"]
//                     },
//                     {
//                         collection: "classed_at",
//                         from: ["Profile"],
//                         to: ["Class"]
//                     },
//                     {
//                         collection: "promotes",
//                         from: ["Profile"],
//                         to: ["Request"]
//                     },
//                     {
//                         collection: "signs_in",
//                         from: ["Device"],
//                         to: ["Profile"]
//                     },
//                     {
//                         collection: "notifies",
//                         from: ["Request", "Response", "Profile"],
//                         to: ["Profile"]
//                     },
//                     {
//                         collection: "tagged_with",
//                         from: ["Request"],
//                         to: ["Tag"]
//                     },
//                     {
//                         collection: "provides",
//                         from: ["Profile"],
//                         to: ["Feedback"]
//                     },
//                     {
//                         collection: "hosts",
//                         from: ["Profile"],
//                         to: ["Service"]
//                     },
//                     {
//                         collection: "serves",
//                         from: ["Service"],
//                         to: ["Response"]
//                     }
//                 ]
//             });
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
//     // .then(() => {
//     //     const action = String(params => {
//     //         const db = require('@arangodb').db;
//     //         [
//     //             {
//     //                 _key: "founder-requester-100",
//     //                 displayName: "Founder Requester",
//     //                 category: "founder-requester",
//     //                 description: "This is awarded to first 100 request creators",
//     //                 badgePic: "https://firebasestorage.googleapis.com/v0/b/helpiyo-app-uploads/o/badges%2Ftest-badge.png?alt=media&token=53218dc4-2224-4ca9-916b-37377f20cf2f",
//     //                 active: true,
//     //                 createdOn: params.now,
//     //                 modifiedOn: params.now,
//     //             },
//     //             {
//     //                 _key: "founder-responder-100",
//     //                 displayName: "Founder Responder",
//     //                 category: "founder-responder",
//     //                 description: "This is awarded to first 100 response creators",
//     //                 badgePic: "https://firebasestorage.googleapis.com/v0/b/helpiyo-app-uploads/o/badges%2Ftest-badge.png?alt=media&token=53218dc4-2224-4ca9-916b-37377f20cf2f",
//     //                 active: true,
//     //                 createdOn: params.now,
//     //                 modifiedOn: params.now,
//     //             },
//     //             {
//     //                 _key: "top-requester-100",
//     //                 displayName: "Top Requester",
//     //                 category: "top-requester",
//     //                 description: "This is awarded to top 100 request creators",
//     //                 badgePic: "https://firebasestorage.googleapis.com/v0/b/helpiyo-app-uploads/o/badges%2Ftest-badge.png?alt=media&token=53218dc4-2224-4ca9-916b-37377f20cf2f",
//     //                 active: true,
//     //                 createdOn: params.now,
//     //                 modifiedOn: params.now,
//     //             },
//     //             {
//     //                 _key: "first-users-100",
//     //                 displayName: "First Users",
//     //                 category: "first-users",
//     //                 description: "This is awarded to first 100 registered users",
//     //                 badgePic: "https://firebasestorage.googleapis.com/v0/b/helpiyo-app-uploads/o/badges%2Ftest-badge.png?alt=media&token=53218dc4-2224-4ca9-916b-37377f20cf2f",
//     //                 active: true,
//     //                 createdOn: params.now,
//     //                 modifiedOn: params.now,
//     //             },
//     //         ].forEach(badge => {
//     //             db.Badge.save(badge);
//     //         });
//     //     });
//     //     return db.transaction({
//     //         write: ["Badge"],
//     //         read: [],
//     //     }, action, {
//     //         now: moment().utc().toDate()
//     //     });
//     // });
// };
