const moment = require("moment");
const ProfileModel = require('../models/profile');
const logger = require('../utils/logger');
const handleInvite = require('../invitations/handle_invite');
const addPoints = require('../utils/add_points');
const sendEmail = require('../utils/send_email');

module.exports = function (data) {
    logger.info('Creating new user for : ' + data.email + " : " + data.heroName);

    const profileData = data;
    // profileData.email = profileData.email.toLowerCase();
    profileData.heroNameLower = profileData.heroName.toLowerCase().trim();
    profileData.modifiedOn = moment().utc().toDate();
    profileData.createdOn = moment().utc().toDate();
    profileData.status = "active";
    profileData.rating = 0;
    profileData.ranking = 100000000;
    profileData.classLabel = "N";
    profileData.points = 0;
    profileData.defaultCurrency = "USD";
    profileData.profilePic = 'https://firebasestorage.googleapis.com/v0/b/helpiyo-app-public/o/public%2Fblank-profile-pic.png?alt=media&token=68faf9c9-3544-408e-aee9-3e833363ed2a';

    // return ProfileModel.findOne({heroNameLower: profileData.heroName.toLowerCase().trim()}).exec()
    //     .catch(error => {
    //         logger.error(error);
    //         throw "db-error";
    //     })
    //     .then(profile => {
    //         if (profile) {
    //             throw "hero-name-exists";
    //         }
    //     })

    const newProfile = new ProfileModel(profileData);
    return newProfile.save(profileData)
        .then(profile => {
            return handleInvite(profile._id, data.referrer)
                .then(() => {
                    return profile;
                });
        })
        .then(profile => {
            return addPoints(profile._id, "daily-usage", profile._id, 200)
                .then(() => {
                    return sendEmail({
                        name: "Helpiyo",
                        email: "noreply@helpiyo.me"
                    }, data.email, "d-0ffb156207f7487ea99d4320c3a8c570", {username: profileData.heroName});
                })
                // .then(() => {
                //     return sendEmail({
                //         name: "Helpiyo",
                //         email: "noreply@helpiyo.me"
                //     }, data.email, "d-26b4b57b4d4f491e93ae62e5cc224f15", {});
                // })
                .then(() => {
                    return profile;
                });
        })
        .then(profile => {
            logger.info("profile created");
            logger.info(profile._id.toString());
            return {code: 200, profileId: profile._id.toString()};
        })
        .catch(error => {
            logger.error(error);
            if (typeof error === typeof "") {
                throw error;
            }
            throw "db-error";
        });
};