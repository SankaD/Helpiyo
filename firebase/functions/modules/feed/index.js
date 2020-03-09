const express = require("express");
const logger = require('../utils/logger');
const Utils = require("../utils/index");

const getFeed = require("./get_feed");
const getFeedV2 = require('./get_feed_v2');

const router = express.Router();

router.get("/get/:latitude/:longitude", (req, res) => {
    logger.info("getting feed");
    logger.debug(req.params);
    const userId = req.user._id;
    const latitude = parseFloat(req.params.latitude);
    const longitude = parseFloat(req.params.longitude);
    return getFeed(userId, latitude, longitude)
        .then((results) => {
            return res.status(200).json(results);
        })
        .catch((error) => {
            logger.error(error);
            return res.status(400).json(error);
        });
});

router.get("/get-v2/:latitude/:longitude", (req, res) => {
    logger.info("getting feed");
    logger.debug(req.params);
    const userId = req.user._id;
    const latitude = parseFloat(req.params.latitude);
    const longitude = parseFloat(req.params.longitude);
    return getFeedV2(userId, latitude, longitude)
        .then((results) => {
            return res.status(200).json(results);
        })
        .catch((error) => {
            logger.error(error);
            return res.status(400).json(error);
        });
});

module.exports = router;