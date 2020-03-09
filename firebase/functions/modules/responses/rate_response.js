// const Joi = require("joi");
// const Logger = require('../utils/logger');
// const DbManager = require('../db/db_manager');
// const Request = require('../models/request');
// const Response = require('../models/response');
//
// // const schema = Joi.object().keys({
// //     rating: Joi.number().integer().positive().max(5).min(1).required(),
// //     comment: Joi.string().max(400).allow(""),
// //     requestId: Joi.string().required(),
// // });
//
// module.exports = function (userId, responseId, rating, comment) {
//     Logger.info("rating response : " + responseId);
//
//     return Response.findOne({_id: responseId, deleted: false, banned: false}).exec()
//         .then(response => {
//             if (!response) {
//                 throw "response-not-found";
//             }
//             return Request.findOne({_id: response.requestId, deleted: false, banned: false}).exec()
//                 .then(request => {
//                     if (!request) {
//                         throw "request-not-found";
//                     }
//                     if (userId === request.createdBy && response.status !== "completed") {
//
//                     }
//                 })
//         })
//     // const validationResults = Joi.validate({rating, comment, requestId}, schema, {stripUnknown: true});
//     // if (validationResults.error) {
//     //     Logger.warn(validationResults.error);
//     //     return Promise.reject("validation-failure");
//     // }
//     //
//     // const action = String(params => {
//     //     const db = require('@arangodb').db;
//     //     const aql = require('@arangodb').aql;
//     //
//     //     const results1 = db._query(aql`
//     //         FOR v,e,p IN 0..2 ANY ${params.responseId} graph 'main'
//     //         FILTER p.vertices[0]!=null && is_same_collection("Response", p.vertices[0]._id)
//     //         && (p.vertices[0].status == "completed")
//     //         && p.edges[0]!=null && is_same_collection("responds_to", p.edges[0]._id)
//     //         && p.vertices[1]!=null && is_same_collection("Request", p.vertices[1]._id) && p.vertices[1].status=="active"
//     //         && p.edges[1]!=null && is_same_collection("requests_with", p.edges[1]._id)
//     //         && p.vertices[2]!=null && is_same_collection("Profile", p.vertices[2]._id) && p.vertices[2]._id==${params.userId}
//     //         return p.vertices[0]
//     //     `);
//     //     if (!results1.hasNext()) {
//     //         throw new Error("not-request-creator");
//     //     }
//     //     db.Response.update(params.responseId, {
//     //         requesterRating: params.rating,
//     //         requesterComment: params.comment,
//     //     });
//     // });
//     // return DbManager.db.transaction({
//     //     read: ["Profile", "Request", "responds_to", "requests_with"],
//     //     write: ["Response"]
//     // }, action, {
//     //     responseId,
//     //     userId,
//     //     rating,
//     //     comment
//     // })
//     //     .catch(error => {
//     //         Logger.warn(error);
//     //         throw "db-error";
//     //     })
//     //     .then(() => {
//     //         Logger.info("response rated successfully");
//     //         return {code: 200};
//     //     })
//     //     .catch(error => {
//     //         Logger.error("response rating failed");
//     //         Logger.error(error);
//     //         throw error;
//     //     });
// };