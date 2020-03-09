const arangodb = require('arangojs');
const logger = require('../logger');
const credentials = require('../../.credentials');
const fs = require('fs');

const DbManager = {
    db: null,
    init: () => {
        try {
            const db = new arangodb.Database({
                url: credentials.db.url,
                maxRetries: 5,
                agentOptions: {
                    rejectUnauthorized:false,
                }
            });
            db.useDatabase(credentials.db.name);
            db.useBasicAuth(credentials.db.user, credentials.db.password);
            console.log("connected to database...");
            DbManager.db = db;
        } catch (error) {
            logger.error(error);
            throw error;
        }
    }
};

module.exports = DbManager;