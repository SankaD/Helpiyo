const express = require('express');
const utils = require('../utils');
const logger = require('../utils/logger');

const createRequest = require('./create_request');
const getActiveRequestsBy = require('./get_active_requests_by');
const completeRequest = require('./complete_request');
const deleteRequest = require('./delete_request');
const activateRequest = require('./activate_request');
const getMyRequests = require('./get_my_requests');
const editRequest = require('./edit_request');
const getNearestRequests = require('./get_nearby_requests');
const promoteRequest = require('./promote_request');
const hasPromoted = require('./has_promoted');
const getMultiple = require('./get_multiple');
const getForService = require('./get_request_for_service');

const router = express.Router();

router.post('/get-multiple', (req, res) => {
    const userId = req.user._id;
    const ids = req.body;
    return getMultiple(userId, ids)
        .then((result) => {
            return res.status(200).json(result);
        })
        .catch((error) => {
            logger.error(error);
            return res.status(400).json(error);
        });

});

router.post('/create', (req, res) => {
    const userId = req.user._id;
    const data = req.body;
    return createRequest(userId, data)
        .then((result) => {
            logger.info('request created');
            logger.debug(result.request);
            return res.status(200).json(result);
        })
        .catch((error) => {
            logger.error('Request creation failed');
            logger.error(error);
            logger.error('user id = ' + userId);
            logger.error(data);
            return res.status(400).json(error);
        });
});

router.post('/edit', (req, res) => {
    const userId = req.user._id;
    const data = req.body;
    return editRequest(userId, data)
        .then(result => {
            logger.info("request updated");
            return res.status(200).json(result);
        })
        .catch(error => {
            logger.warn("request update failed");
            logger.warn(error);
            return res.status(400).json(error);
        });
});

router.get('/get-active-requests-by/:id', (req, res) => {
    const userId = req.user._id;
    const profileId = req.params.id;
    return getActiveRequestsBy(userId, profileId)
        .then((result) => {
            logger.debug(result);
            return res.status(200).json(result);
        })
        .catch((error) => {
            logger.error(error);
            return res.status(400).json(error);
        });
});
router.get('/get-my-requests/', (req, res) => {
    const userId = req.user._id;
    return getMyRequests(userId)
        .then((result) => {
            logger.debug(result);
            return res.status(200).json(result);
        })
        .catch((error) => {
            logger.error(error);
            return res.status(400).json(error);
        });
});
router.post('/complete', (req, res) => {
    const userId = req.user._id;
    const requestId = req.body.requestId;
    const rating = req.body.rating;
    const comment = req.body.comment;
    return completeRequest(userId, requestId, rating, comment)
        .then((result) => {
            logger.info("request completed");
            return res.status(200).json(result);
        })
        .catch((error) => {
            logger.error("request didn't complete");
            logger.error(error);
            return res.status(400).json(error);
        });
});

router.get('/delete/:requestId', (req, res) => {
    const userId = req.user._id;
    const requestId = req.params.requestId;
    return deleteRequest(userId, requestId)
        .then((result) => {
            return res.status(200).json(result);
        })
        .catch((error) => {
            logger.error(error);
            return res.status(400).json(error);
        });
});

router.get('/activate/:requestId', (req, res) => {
    const userId = req.user._id;
    const requestId = req.params.requestId;

    return activateRequest(userId, requestId)
        .then((result) => {
            logger.info('request activated');
            return res.status(200).json(result);
        })
        .catch((error) => {
            logger.warn(error);
            return res.status(400).json(error);
        });
});

router.get('/get-nearest/:latitude/:longitude/:radius', (req, res) => {
    const userId = req.user._id;
    const latitude = req.params.latitude;
    const longitude = req.params.longitude;
    const radius = req.params.radius;
    return getNearestRequests(userId, latitude, longitude, radius)
        .then(result => {
            return res.status(200).json(result);
        })
        .catch(error => {
            logger.warn(error);
            return res.status(400).json(error);
        });
});

router.post('/promote', (req, res) => {
    const userId = req.user._id;
    const requestId = req.body.requestId;

    return promoteRequest(userId, requestId)
        .then(result => {
            return res.status(200).json(result);
        })
        .catch(error => {
            logger.warn(error);
            return res.status(400).json(error);
        });
});
router.get('/has-promoted/:requestId', (req, res) => {
    const userId = req.user._id;
    const requestId = req.params.requestId;

    return hasPromoted(userId, requestId)
        .then(result => {
            return res.status(200).json(result);
        })
        .catch(error => {
            return res.status(400).json(error);
        });
});

router.get("/get-for-service/:serviceId", (req, res) => {
    const userId = req.user._id;
    const serviceId = req.params.serviceId;

    return getForService(userId, serviceId)
        .then(result => {
            return res.status(200).json(result);
        })
        .catch(error => {
            return res.status(400).json(error);
        });
});

module.exports = router;
