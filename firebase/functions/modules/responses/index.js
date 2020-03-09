const express = require("express");
const logger = require('../utils/logger');

const utils = require("../utils");
const createResponse = require("./create_response");
const getMultiple = require("./get_multiple");
// const getResponsesCreatedBy = require("./get_responses_created_by");
const acceptResponse = require("./accept_response");
const completeResponse = require("./complete_response");
const getResponsesFor = require("./get_responses_for_request");
const rateResponse = require("./rate_response");
const activateResponse = require("./activate_response");
const getMyResponses = require('./get_my_responses');
// const getMultipleMeta = require('./get_meta');
const deleteResponse = require('./delete_response');
const rejectResponse = require('./reject_response');
const editResponse = require('./edit_response');

const router = express.Router();

router.post("/create", (req, res) => {
    const userId = req.user._id;
    const responseData = req.body;
    return createResponse(userId, responseData)
        .then((result) => {
            return res.status(200).json(result);
        })
        .catch((error) => {
            logger.warn(error);
            return res.status(400).json(error);
        });
});

router.post('/edit', (req, res) => {
    const userId = req.user._id;
    const responseData = req.body;
    return editResponse(userId, responseData)
        .then(result => {
            return res.status(200).json(result);
        })
        .catch(error => {
            logger.warn(error);
            return res.status(400).json(error);
        });
});

router.get("/delete/:id", (req, res) => {
    const userId = req.user._id;
    const responseId = req.params.id;

    return deleteResponse(userId, responseId)
        .then(result => {
            return res.status(200).json(result);
        })
        .catch(error => {
            logger.warn(error);
            return res.status(400).json(error);
        });
});

router.post("/get-multiple", (req, res) => {
    const userId = req.user._id;
    const ids = req.body;
    return getMultiple(userId, ids)
        .then((result) => {
            return res.status(result.code).json(result);
        })
        .catch((error) => {
            logger.warn(error);
            return res.status(error.code).json(error);
        });
});
// router.post('/get-multiple-meta', (req, res) => {
//     return getMultipleMeta(req.user._id, req.body)
//         .then(result => {
//             return res.status(result.code).json(result);
//         })
//         .catch(error => {
//             logger.warn(error);
//             return res.status(error.code).json(error);
//         });
//
// });
router.get("/get-responses-created-by/:profileId", (req, res) => {
    const userId = req.user._id;
    return getResponsesCreatedBy(userId)
        .then((result) => {
            logger.info(result);
            return res.status(200).json(result);
        })
        .catch((error) => {
            logger.warn(error);
            return res.status(400).json(error);
        });
});
router.get("/get-my", (req, res) => {
    const userId = req.user._id;
    return getMyResponses(userId)
        .then(result => {
            logger.info(result);
            return res.status(200).json(result);
        })
        .catch(error => {
            logger.warn(error);
            return res.status(400).json(error);
        });
});
router.get("/get-responses-for/:requestId", (req, res) => {
    const userId = req.user._id;
    const requestId = req.params.requestId;
    return getResponsesFor(userId, requestId)
        .then((result) => {
            return res.status(200).json(result);
        })
        .catch((error) => {
            logger.warn(error);
            return res.status(400).json(error);
        });
});
router.get("/accept/:responseId", (req, res) => {
    const userId = req.user._id;
    const responseId = req.params.responseId;
    return acceptResponse(userId, responseId)
        .then((result) => {
            return res.status(200).json(result);
        })
        .catch((error) => {
            logger.warn(error);
            return res.status(400).json(error);
        });
});

router.post("/complete", (req, res) => {
    const userId = req.user._id;
    const responseData = req.body;
    return completeResponse(userId,
        responseData.responseId,
        responseData.rating,
        responseData.comment)
        .then((result) => {
            return res.status(200).json(result);
        })
        .catch((error) => {
            logger.warn(error);
            return res.status(400).json(error);
        });
});

router.post("/rate", (req, res) => {
    const userId = req.user._id;
    const responseId = req.body.key;
    const rating = req.body.rating;
    const comment = req.body.comment;

    logger.info("Rating response : " + responseId);
    return rateResponse(userId, responseId, rating, comment)
        .then((result) => {
            logger.info(result);
            return res.status(200).json(result);
        })
        .catch((error) => {
            logger.warn(error);
            return res.status(400).json(error);
        });
});

router.get("/activate/:responseId", (req, res) => {
    const userId = req.user._id;
    const responseId = req.params.responseId;

    return activateResponse(userId, responseId)
        .then((result) => {
            logger.info("response activated");
            logger.info(result);
            return res.status(200).json(result);
        })
        .catch((error) => {
            logger.warn(error);
            return res.status(400).json(error);
        });
});

router.post("/reject/", (req, res) => {
    const userId = req.user._id;
    const responseId = req.body.responseId;
    const rating = req.body.rating;
    const comment = req.body.comment;
    logger.info("req.body = " + JSON.stringify(req.body));

    return rejectResponse(userId, responseId, rating, comment)
        .then(result => {
            logger.debug(result);
            return res.status(200).json(result);
        })
        .catch(error => {
            logger.warn(error);
            return res.status(400).json(error);
        });
});

module.exports = router;