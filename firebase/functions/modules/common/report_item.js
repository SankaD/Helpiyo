const moment = require('moment');
const Report = require('../models/report');
const Profile = require('../models/profile');
const Request = require('../models/request');
const Response = require('../models/response');
const Service = require('../models/service');
const sendEmail = require('../utils/send_email');

const logger = require('../utils/logger');
module.exports = (userId, elementId, comment, category, targetType) => {
    logger.info("reporting a item : " + elementId + " by user : " + userId);

    let now = moment().utc().toDate();
    let report = new Report({
        comment: comment,
        category: category,
        from: userId,
        to: elementId,
        targetType: targetType,
        modifiedOn: now,
        createdOn: now
    });

    let model = Request;
    if (targetType === "request") {
        model = Request;
    } else if (targetType === "service") {
        model = Service;
    } else if (targetType === "response") {
        model = Response;
    } else if (targetType === "profile") {
        model = Profile;
    }

    return report.save()
        .then((result) => {
            return model.findById(elementId).exec()
                .then(result => {
                    let post = targetType === "profile" ? result.heroName : result.post;
                    return Profile.findById(userId).exec()
                        .then(profile => {
                            return sendEmail({
                                name: "Helpiyo",
                                email: "noreply@helpiyo.me"
                            }, "reports@helpiyo.me", "d-0e189ad8620a45928cbbd0f327a32f9c", {
                                USER: profile.heroName,
                                ELEMENT_TYPE: targetType,
                                ELEMENT_ID: elementId,
                                CATEGORY: category,
                                COMMENT: comment,
                                CREATED_ON: moment(now).format().toString(),
                                POST: post,
                            });
                        });
                });
        })
        .then(() => {
            logger.info("successfully reported request");
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