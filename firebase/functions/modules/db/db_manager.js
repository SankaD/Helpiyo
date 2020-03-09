// const mongoose = require('mongoose');
// const logger = require('../utils/logger');
// const fs = require('fs');
//
// const DbManager = {
//     db: null,
//     init: (url, username, password, dbName) => {
//
//         try {
//             return mongoose.connect(url);
//             // const db = new arangodb.Database({
//             //     url: url,
//             //     maxRetries: 5,
//             //     agentOptions: {
//             //         rejectUnauthorized: false,
//             //     },
//             // });
//             // db.useDatabase(dbName);
//             // db.useBasicAuth(username, password);
//             // console.log("connected to database...");
//             // DbManager.db = db;
//         } catch (error) {
//             logger.error(error);
//             throw error;
//         }
//     }
// };
//
// module.exports = DbManager;