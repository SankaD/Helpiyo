const Connections = require('./connections');
const logger = require('../utils/logger');

module.exports = (transactionData) => {

    return Connections.getConnection(connection => {
        return connection.beginConnection()
            .then(() => {
                const results = connection.query("select amount from wallets where id=?", [transactionData.sender]);
                console.log(results);
            });
    });

};