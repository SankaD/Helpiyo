// const logger = require('../utils/logger');
// const DbManager = require('../db/db_manager');
// const aql = require('arangojs').aql;
//
// module.exports = function (userId, ids) {
//     logger.info('Getting multiple requests meta : ', JSON.stringify(ids));
//
//     if (!ids) {
//         logger.error("ids not provided");
//         return Promise.reject("empty-data");
//     }
//     return DbManager.db.query(aql`
//             FOR request IN Request FILTER request._id IN ${ids}
//             FILTER request.deleted != true && request.status != "draft"
//             SORT request._id ASC
//             RETURN {_id:request._id, modifiedOn:request.modifiedOn}`)
//         .catch(error => {
//             logger.warn(error);
//             throw "db-error";
//         })
//         .then(cursor => {
//             return cursor.all();
//         })
//         .then(requests => {
//             return {code: 200, data: requests};
//         });
// };