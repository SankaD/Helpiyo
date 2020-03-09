// import ProfileHandler from '../common/data_handlers/profile_handler';
// import Logger from '../utils/logger';
//
// // export default (elements) => {
// //   Logger.info('filling creators');
// //   const profileIds = [];
// //   elements.forEach((element) => {
// //     if (!element.createdBy) {
// //       Logger.error(element);
// //       throw 'Created by field not found';
// //     }
// //     profileIds.push(element.createdBy);
// //   });
// //   return ProfileHandler.getProfiles(profileIds)
// //     .catch((errors) => {
// //       Logger.info('getting profiles for elements failed');
// //       throw errors;
// //     })
// //     .then((profiles) => {
// //       Logger.info('profiles received for responses');
// //       const profileMap = {};
// //       for (let i = 0; i < profiles.length; i += 1) {
// //         const profile = profiles[i];
// //         profileMap[profile._id] = profile;
// //       }
// //       return elements.map(element => Object.assign({}, element, {
// //         creator: profileMap[element.createdBy],
// //       }));
// //     });
// // };
