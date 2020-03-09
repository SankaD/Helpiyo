const logger = require('../utils/logger');

module.exports = (userId) => {
    logger.info("getting message notifications");

    // return DbManager.db.query(aql`
    //     for v,e,p in 0..1 outbound ${userId} graph 'main'
    //     filter p.edges[0]!=null && is_same_collection('message_in', p.edges[0])
    //     && p.edges[0].deleted!=true
    //     && p.vertices[1]!=null && is_same_collection('MessageThread', p.vertices[1])
    //     && p.vertices[1].deleted!=true
    //     && p.edges[0].lastReadOn < p.vertices[1].modifiedOn
    //     limit 100
    //     return {_id:p.vertices[1]._id}
    // `, {userId})
    //     .catch(error => {
    //         logger.warn(error);
    //         throw "db-error";
    //     })
    //     .then(cursor => {
    //         return cursor.all();
    //     })
    //     .then(notifications => {
    //         logger.info("message notifications received : " + notifications.length);
    //         return {code: 200, notifications};
    //     });
};