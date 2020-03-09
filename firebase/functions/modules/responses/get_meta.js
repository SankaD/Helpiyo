// const logger = require('../utils/logger');
// const DbManager = require('../db/db_manager');
// const aql = require('arangojs').aql;
//
// module.exports = function (userId, responseIds) {
//     logger.info("getting response meta data for : " + userId);
//     logger.debug(responseIds);
//
//     if (!responseIds) {
//         logger.warn("response ids not provided");
//         return Promise.reject("empty-data");
//     }
//     return DbManager.db.query(aql`
//       for x in union_distinct((
//             for v,e,p in 0..1 outbound ${userId} graph 'main'
//             filter p.edges[0]!=null && is_same_collection('responds_with', p.edges[0])
//             && p.vertices[1]!=null && is_same_collection('Response', p.vertices[1])
//             && p.vertices[1]._id in ${responseIds}
//             && p.vertices[1].status != "draft"
//             && p.vertices[1].deleted != true
//             return merge(p.vertices[1],{createdBy: ${userId}})
//         ),(
//             for v,e,p in 0..3 any ${userId} graph 'main'
//             filter p.edges[0]!=null && is_same_collection('requests_with', p.edges[0])
//             && p.vertices[1]!=null && is_same_collection('Request', p.vertices[1])
//             && p.edges[1]!=null && is_same_collection('responds_to', p.edges[1])
//             && p.vertices[2]!=null && is_same_collection('Response', p.vertices[2])
//             && p.vertices[2]._id in ${responseIds}
//             && p.vertices[2].status != "draft"
//             && p.vertices[2].deleted != true
//             && p.edges[2]!=null && is_same_collection('responds_with', p.edges[2])
//             && p.vertices[3]!=null && is_same_collection('Profile',p.vertices[3])
//             return merge(p.vertices[2], {createdBy: p.vertices[3]._id})
//         ))
//         sort x._id
//         return {_id:x._id,modifiedOn:x.modifiedOn}
//     `)
//         .catch(error => {
//             logger.warn(error);
//             throw "db-error";
//         })
//         .then(cursor => {
//             return cursor.all();
//         })
//         .then(responses => {
//             return {code: 200, data: responses};
//         });
// };