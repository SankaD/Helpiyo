const express = require("express");
const logger = require('../utils/logger');

const createMessage = require('./create_message');
const getMessageInThread = require('./get_messages_in_thread');

const router = express.Router();

// router.post("/get-multiple", (req, res) => {
//     const userId = req.user._id;
//     const ids = req.body;
//     return getMultiple(userId, ids)
//         .then(result => {
//             return res.status(200).json(result);
//         })
//         .catch(error => {
//             logger.warn(error);
//             return res.status(400).json(error);
//         });
// });
// router.post("/get-multiple-meta", (req, res) => {
//     const userId = req.user._id;
//     const ids = req.body;
//     return getMultipleMeta(userId, ids)
//         .then(result => {
//             return res.status(200).json(result);
//         })
//         .catch(error => {
//             logger.warn(error);
//             return res.status(400).json(error);
//         });
// });
router.post("/create-message", (req, res) => {
    const userId = req.user._id;
    const threadId = req.body.threadId;
    const content = req.body.content;
    return createMessage(userId, threadId, content)
        .then(result => {
            return res.status(200).json(result);
        })
        .catch(error => {
            logger.warn(error);
            return res.status(400).json(error);
        });
});

router.get('/get-messages-in-thread/:threadId', (req, res) => {
    const userId = req.user._id;
    const threadId = req.params.threadId;
    return getMessageInThread(userId, threadId)
        .then(result => {
            return res.status(200).json(result);
        })
        .catch(error => {
            logger.warn(error);
            return res.status(400).json(error);
        });
});
module.exports = router;