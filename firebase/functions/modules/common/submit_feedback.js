const moment = require('moment');
const logger = require('../utils/logger');
const Feedback = require('../models/feedback');
const Profile = require('../models/profile');
const sendEmail = require('../utils/send_email');

module.exports = (userId, feedback) => {
    logger.info("saving feedback by : " + userId);

    let now = moment().utc().toDate();
    let feedback2 = new Feedback({
        feedback: feedback,
        createdBy: userId,
        createdOn: now,
        modifiedOn: now,
    });

    return feedback2.save()
        .then((result) => {
            return Profile.findById(userId).exec()
                .then(profile => {
                    return sendEmail({
                        name: "Helpiyo",
                        email: "noreply@helpiyo.me"
                    }, "feedback@helpiyo.me", "d-37d8434083394254bec26cab6ed36690", {
                        USER: profile.heroName,
                        FEEDBACK: feedback,
                        CREATED_ON: moment(now).format().toString(),
                    });
                });
        })
        .then(() => {
            logger.info("feedback saved");
            return {code: 200};
        })
        .catch(error => {
            logger.error(error);
            if (typeof error === typeof "") {
                throw error;
            }
            throw "db-error";
        });
};