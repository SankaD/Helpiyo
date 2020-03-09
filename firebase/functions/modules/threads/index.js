const express = require("express");
const logger = require('../utils/logger');

const getThreadForUser = require('./get_thread_for_user');
const getMyThreads = require('./get_my_threads');

const router = express.Router();

router.get("/get-my-threads", (req, res) => {
    const userId = req.user._id;
    return getMyThreads(userId)
        .then(result => {
            return res.status(200).json(result);
        })
        .catch(error => {
            logger.warn(error);
            return res.status(400).json(error);
        });
});

router.get("/get-thread-for-user/:userId", (req, res) => {
    const userId = req.user._id;
    const otherUserId = req.params.userId;

    return getThreadForUser(userId, otherUserId)
        .then(result => {
            return res.status(200).json(result);
        })
        .catch(error => {
            return res.status(400).json(error);
        });
});
//
// router.post("/get-thread-for-request/:requestId", (req, res) => {
//
// });

module.exports = router;