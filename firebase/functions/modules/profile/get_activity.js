const logger = require('../utils/logger');
const DbManager = require('../db/db_manager');

// module.exports = (userId, profileId) => {
//     logger.info("getting user activity : " + userId);
//
//     const sameUser = (userId === profileId);
//     return DbManager.db.query(aql`
//         // for v,e,p in 0..1 outbound ${profileId} graph 'main'
//         // filter p.edges[0]!=null && (
//         // (is_same_collection('requests_with', p.edges[0]) && p.vertices[1].status!='draft' && !p.vertices[1].deleted)
//         // || ( ${sameUser} && is_same_collection('responds_with', p.edges[0]) && p.vertices[1].status!='draft' && !p.vertices[1].deleted)
//         // || ( is_same_collection('follows', p.edges[0]))
//         // )
//         // sort p.vertices[1].modifiedOn DESC
//         // limit 10
//         // return {target:p.vertices[1]._id, modifiedOn:p.vertices[1].modifiedOn,type:p.edges[0]}
//         for x in union_distinct(
//         (),
//         (),
//         ()
//         )
//         limit 20
//         return x
//     `)
//         .catch(error => {
//             logger.error(error);
//             throw "db-error";
//         })
//         .then(cursor => {
//             return cursor.all();
//         })
//         .then(results => {
//             logger.info("activity generated. count : " + results.length);
//             results.forEach(item => {
//                 if (item.type._id.includes("requests_with")) {
//                     item.type = "request-creation";
//                 } else if (item.type._id.includes("responds_with")) {
//                     item.type = "response-creation";
//                 } else if (item.type._id.includes("follows")) {
//                     item.type = "follows";
//                 }
//             });
//             return {code: 200, results};
//         });
//
// };