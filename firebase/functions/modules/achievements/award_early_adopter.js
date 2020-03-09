const moment = require('moment');
const logger = require('../utils/logger');
const Achievement = require('../models/achievements');
const Badge = require('../models/badge');
const Profile = require('../models/profile');
const Point = require('../models/point');
const Notification = require('../models/notification');
const addPoints = require('../utils/add_points');

module.exports = (profileId, badgeId) => {
    logger.info("awarding early adopter badges");

    const deadline = moment("20190201", "YYYYMMDD").utc().toDate();
    const now = moment().utc().toDate();

    return Profile.find({createdOn: {"$lt": deadline}}).exec()
        .then(profiles => {
            let promises = profiles.map(profile => {
                return Achievement.findOne({from: "early-adopter", to: profile._id}).exec()
                    .then(result => {
                        if (result) {
                            return Promise.resolve();
                        }
                        let ach = new Achievement({
                            from: "early-adopter",
                            to: profile._id,
                            createdOn: now,
                            modifiedOn: now,
                            expired: false
                        });
                        return ach.save()
                            .then(() => {
                                return addPoints(profile._id, "early-adopter", profile._id);
                            })
                            .then(result => {
                                logger.info("awarding early adopter badge to : " + profile._id);
                                let not = new Notification({
                                    from: "early-adopter",
                                    to: profile._id,
                                    type: "award-badge",
                                    createdOn: now,
                                    modifiedOn: now,
                                });
                                return not.save();
                            });
                    });
            });
            return Promise.all(promises);
        })
        .then(() => {
            logger.info("finished awarding early adopter");
        });

};