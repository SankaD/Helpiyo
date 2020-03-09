// const aql = require('arangojs').aql;
// const DbManager = require('../../modules/db/db_manager');
// const logger = require('../utils/logger');
// const Profile = require('../models/profile');
// const follows = require('../models/follows');
//
// module.exports = function (userId, profileIds) {
//     logger.info("getting profiles for following ids for : " + userId);
//     // logger.debug(arguments);
//     // const profileIds = entries.map(entry => entry._id);
//
//
//     return DbManager.db.query(aql`
//         FOR profile IN Profile
//         FILTER profile._id IN ${profileIds}
//         AND profile.status != 'new'
//         AND profile.banned != true
//         AND profile.deactivated != true
//         LET count=COUNT(
//             for v,e,p in 0..1 inbound profile._id graph 'main'
//             filter p.edges[0]!=null && is_same_collection('follows', p.edges[0]._id)
//             && p.edges[0].deleted!=true
//             return 1
//         )
//         RETURN MERGE(profile,{followerCount:count})
//         `, {profileIds: profileIds})
//         .catch(error => {
//             logger.warn(error);
//             throw "db-error";
//         })
//         .then(cursor => {
//             return cursor.all();
//         })
//         .then(profiles => {
//             return profiles.map(profile => {
//                 return {
//                     _id: profile._id,
//                     heroName: profile.heroName,
//                     modifiedOn: profile.modifiedOn,
//                     createdOn: profile.createdOn,
//                     status: profile.status,
//                     classLabel: profile.classLabel,
//                     rating: profile.rating,
//                     rank: profile.classRanking,
//                     points: profile.points,
//                     followerCount: profile.followerCount,
//                     profilePic: profile.profilePic || 'https://firebasestorage.googleapis.com/v0/b/helpiyo-app-public/o/public%2Fblank-profile-pic.png?alt=media&token=68faf9c9-3544-408e-aee9-3e833363ed2a'
//                 };
//             });
//         })
//         .then(profiles => {
//             logger.info("profiles received successfully. count : " + profiles.length);
//             return {code: 200, results: profiles};
//         });
// };