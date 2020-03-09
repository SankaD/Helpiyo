const express = require('express');
const router = express.Router();

const getAchievements = require('./get_achievements');

router.get("/get/:profileId", (req, res) => {
    const userId = req.user._id;
    const profileId = req.params.profileId;
    return getAchievements(userId, profileId)
        .then(results => {
            return res.status(200).json(results);
        })
        .catch(error => {
            return res.status(400).json(error);
        });
});

module.exports = router;