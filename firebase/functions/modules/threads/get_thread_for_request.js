const logger = require('../utils/logger');

module.exports = function (userId, requestId) {
    logger.info("getting thread for request : " + requestId + " by " + userId);

    // const action = String(params => {
    //     const db = require('@arangodb').db;
    //     const aql = require('@arangodb').aql;
    //
    //     let isUserParticipant = false;
    //     let result = db._query(aql`
    //     for v,e,p in 0..1 outbound ${params.userId} graph 'main'
    //     filter p.edges[0]!=null && is_same_collection('requests_with', p.edges[0])
    //     && p.vertices[1]!=null && is_same_collection('Request', p.vertices[1])
    //     && p.vertices[1].deleted!=true
    //     && p.vertices[1].status!="draft"
    //     return p.vertices[1]
    //     `);
    //     if (!result.hasNext()) {
    //         result = db._query(aql`
    //         for v,e,p in 0..2 any ${params.userId} graph 'main'
    //         filter p.edges[0]!=null && is_same_collection('responds_with', p.edges[0])
    //         && p.vertices[1]!=null && is_same_collection('Response', p.vertices[1])
    //         && p.vertices[1].status in ["accepted","completed"]
    //         && p.vertices[1].deleted != true
    //         && p.edges[1]!=null && is_same_collection('responds_to', p.edges[1])
    //         && p.vertices[2]!=null && is_same_collection('Request', p.vertices[2])
    //         && p.vertices[2].deleted!=true
    //         && p.vertices[2].status!="draft"
    //         return p.vertices[2]
    //         `);
    //         if (!result.hasNext()) {
    //             throw new Error("request-not-found");
    //         }
    //     }
    //
    //     result = db._query(aql`
    //     for v,e,p 0..1 outbound ${params.requestId} graph 'main'
    //     filter p.edges[0]!=null && is_same_collection('messages_for', p.edges[0])
    //     && p.vertices[1]!=null && is_same_collection('MessageThread', p.vertices[1])
    //     return p.vertices[1]
    //     `);
    //
    // });


    // return Profile.findById(otherUserId).exec()
    //     .catch(error => {
    //         logger.error(error);
    //         throw Errors.dbError;
    //     })
    //     .then(profile => {
    //         if (!profile) {
    //             logger.warn("profile not found");
    //             throw Errors.profileNotFound;
    //         } else if (profile.status !== "active") {
    //             logger.warn("profile status is " + profile.status);
    //             throw Errors.profileNotActive;
    //         } else if (profile.banned) {
    //             logger.warn("profile is banned");
    //             throw Errors.profileNotFound;
    //         } else if (profile.deactivated) {
    //             logger.warn("profile is deactivated");
    //             throw Errors.profileNotFound;
    //         }
    //
    //         return MessageThread.findOne({
    //             groupThread: true,
    //             participants: {
    //                 $all: [userId]
    //             }
    //         }).exec()
    //             .catch(error => {
    //                 logger.error(error);
    //                 throw Errors.dbError;
    //             });
    //     })
    //     .then(thread => {
    //         if (thread) {
    //             return thread._id;
    //         }
    //         const newThread = new MessageThread({
    //             participants: [userId, otherUserId],
    //             createdBy: userId
    //         });
    //
    //         return newThread.save()
    //             .catch(error => {
    //                 logger.error(error);
    //                 throw Errors.dbError;
    //             })
    //             .then(thread => {
    //                 logger.info("new thread created");
    //                 return thread._id;
    //             });
    //     })
    //     .then(result => {
    //         return {
    //             code: 200,
    //             threadId: result
    //         };
    //     });
};