const moment = require('moment');
const logger = require('../utils/logger');
const Profile = require('../models/profile');
const Achievement = require('../models/achievements');
const Notification = require('../models/notification');

module.exports = () => {
    logger.info("awarding top hero");

    const now = moment().utc().toDate();
    return Achievement.updateMany({
        from: {
            "$in": ["hero-1", "hero-10", "hero-100"]
        },
        expired: false
    }, {
        expired: true,
        expiredOn: now,
        modifiedOn: now,
    }).exec()
        .then(() => {
            return Profile.find({}).sort({points: -1, rating: -1}).limit(100).exec();
        })
        .then(profiles => {
            let promises = profiles.map((profile, index) => {
                let label = "";
                if (index === 1) {
                    label = "hero-1";
                } else if (index <= 10) {
                    label = "hero-10";
                } else if (index <= 100) {
                    label = "hero-100";
                }
                let ach = new Achievement({
                    from: label,
                    to: profile._id,
                    createdOn: now,
                    modifiedOn: now,
                    info: moment(now).format("YYYY-MMMM")
                });
                return ach.save()
                    .then(() => {
                        logger.info("awarded : " + label + " to : " + profile._id);
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
            return Promise.all(promises);
        })
        .then(()=>{
            logger.info("finished awarding top hero");
        });
};