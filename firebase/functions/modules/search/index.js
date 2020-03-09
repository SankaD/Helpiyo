const express = require("express");
const logger = require('../utils/logger');

const search = require('./search');

const router = express.Router();

router.post('/search', (req, res) => {
    const userId = req.user.uid;
    const text = req.body.text;
    const count = req.body.count;
    const searchType = req.body.filter;

    return search(userId, text, count, searchType)
        .then(results => {
            return res.status(200).json(results);
        })
        .catch(error => {
            logger.error(error);
            return res.status(400).json(error);
        });
});

module.exports = router;