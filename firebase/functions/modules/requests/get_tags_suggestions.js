// const aql = require('arangojs').aql;
const DbManager = require('../db/db_manager');
const logger = require('../utils/logger');

module.exports = (userId, text) => {
    logger.info("getting tag suggestions for : " + text);
    // return DbManager.db.query(aql`
    //     for tag in Tag
    //     filter CONTAINS(tag.text, ${text})
    //     return tag
    // `)
    //     .catch(error => {
    //         logger.warn(error);
    //         throw "db-error";
    //     })
    //     .then(cursor => {
    //         return cursor.all();
    //     })
    //     .then(tags => {
    //         logger.info("received tags. count=" + tags.length);
    //         return {code: 200, tags};
    //     });
};