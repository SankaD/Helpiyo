const moment = require("moment");
const logger = require('../utils/logger');
const Badge = require('../models/badge');

const badges = [
    {
        _id: "early-adopter",
        label: "Early Adopter",
        description: "Awarded to those who have joined the community first",
        imageUrl: "https://firebasestorage.googleapis.com/v0/b/helpiyo-app-public/o/public%2Fbadges%2Fearly-adopter.png?alt=media&token=865a0ed2-225a-418a-a223-e7871087cc0b",
    }, {
        _id: "hero-1",
        label: "Top Hero",
        description: "Awarded to the current top hero",
        imageUrl: "https://firebasestorage.googleapis.com/v0/b/helpiyo-app-public/o/public%2Fbadges%2Fhero-1.png?alt=media&token=7261d3af-fa8c-45b4-a0a2-192dc068eea5"
    }, {
        _id: "hero-10",
        label: "Top 10 Hero",
        description: "Awarded to the top 10 heroes",
        imageUrl: "https://firebasestorage.googleapis.com/v0/b/helpiyo-app-public/o/public%2Fbadges%2Fhero-10.png?alt=media&token=f1f4ff9b-65df-4e83-8635-d18722489f9f"
    }, {
        _id: "hero-100",
        label: "Top 100 Hero",
        description: "Awarded to the top 100 heroes",
        imageUrl: "https://firebasestorage.googleapis.com/v0/b/helpiyo-app-public/o/public%2Fbadges%2Fhero-100.png?alt=media&token=2a523a01-9d59-498a-8971-1ad39fabad1b"
    }];

module.exports = () => {
    logger.info("checking for badges");

    const now = moment().utc().toDate();
    let promises = badges.map(badgeData => {
        let id = badgeData._id;
        return Badge.findById(id).exec()
            .then(badge => {
                if (badge) {
                    return Promise.resolve();
                }
                badgeData.createdOn = now;
                badgeData.modifiedOn = now;
                let newBadge = new Badge(badgeData);
                return newBadge.save()
                    .then(() => {
                        logger.info("created new badge : " + id);
                    });
            });
    });

    return Promise.all(promises)
        .then(() => {
            logger.info("badges checked and updated");
        });
};