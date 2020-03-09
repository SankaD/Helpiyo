const Connections = require('./connections');
const logger = require('../utils/logger');
const uuid = require('uuid/v1');

module.exports = () => {
    logger.info("creating new wallet");

    return Connections.getConnection(connection => {
        return connection.beginConnection()
            .then(() => {
                const walletId = uuid();
                return connection.query("inser into wallets (id,amount) values (?,0)", [id])
                    .then(result => {
                        logger.info(result);
                        connection.end();
                        return walletId;
                    });
            })
            .then(walletId => {
                return walletId;
            });
    });

};