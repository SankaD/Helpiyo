const express = require('express');
const utils = require('../utils');
const logger = require('../utils/logger');

const router = express.Router();

router.get('/get-balance/', (req, res) => {

});

router.post("/new-transaction", (req, res) => {
    logger.error("not supported yet");
    res.sendStatus(500);
});


module.exports = router;