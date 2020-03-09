// const logger = require('../utils/logger');
//
// module.exports = function (userId) {
//     var query = "for vertex, edge in 1..1 OUTBOUND @startNode GRAPH 'common'\n" +
//         "filter edge!=null && IS_SAME_COLLECTION('responds',edge._id) && vertex.status==\"active\" \n limit 200" +
//         "return edge.requestId\n";
//
//     console.log("Getting responses created by : " + userId);
//
//     return global.db.query(query, {startNode: "Profiles/" + userId})
//         .catch(error => {
//             logger.warn(error);
//             throw "db-error";
//         })
//         .then((cursor) => {
//             return cursor.all()
//                 .catch((error) => {
//                     console.error(error);
//                     throw {internal_code: 500, message: "db-error"};
//                 })
//                 .then((results) => {
//                     console.log("Response count = " + results.length);
//                     return {internal_code: 200, responses: results};
//                 });
//         });
// };