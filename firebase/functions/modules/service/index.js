const express = require('express');
const logger = require('../utils/logger');

const createService = require('./create_service');
const activateService = require('./activate_service');
const getServices = require('./get_services');
const toggleService = require('./toggle_service');
const updateService = require('./update_service');
const promoteService = require('./promote_service');
const hasPromoted = require('./has_promoted');
const deleteService = require('./delete_service');
const getService = require('./get_service');

const router = express.Router();

router.post("/create-service", (req, res) => {
    const userId = req.user._id;
    const serviceData = req.body;
    return createService(userId, serviceData)
        .then(result => {
            return res.status(200).json(result);
        })
        .catch(error => {
            logger.error(error);
            return res.status(400).json(error);
        });
});
router.post("/update-service", (req, res) => {
    const userId = req.user._id;
    const serviceData = req.body;
    return updateService(userId, serviceData)
        .then(result => {
            return res.status(200).json(result);
        })
        .catch(error => {
            logger.error(error);
            return res.status(400).json(error);
        });
});
router.get("/activate-service/:serviceId", (req, res) => {
    const userId = req.user._id;
    const serviceId = req.params.serviceId;
    return activateService(userId, serviceId)
        .then(result => {
            return res.status(200).json(result);
        })
        .catch(error => {
            logger.error(error);
            return res.status(400).json(error);
        });
});

router.get("/get-services/:profileId", (req, res) => {
    const userId = req.user._id;
    const profileId = req.params.profileId;
    return getServices(userId, profileId)
        .then(result => {
            return res.status(200).json(result);
        })
        .catch(error => {
            logger.error(error);
            return res.status(400).json(error);
        });
});

router.get("/toggle-service/:serviceId", (req, res) => {
    const userId = req.user._id;
    const serviceId = req.params.serviceId;
    return toggleService(userId, serviceId)
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
    const serviceId = req.body.serviceId;

    return promoteService(userId, serviceId)
        .then(result => {
            return res.status(200).json(result);
        })
        .catch(error => {
            logger.warn(error);
            return res.status(400).json(error);
        });
});
router.get('/has-promoted/:serviceId', (req, res) => {
    const userId = req.user._id;
    const serviceId = req.params.serviceId;

    return hasPromoted(userId, serviceId)
        .then(result => {
            return res.status(200).json(result);
        })
        .catch(error => {
            logger.warn(error);
            return res.status(400).json(error);
        });
});

router.get("/delete-service/:serviceId", (req, res) => {
    const userId = req.user._id;
    const serviceId = req.params.serviceId;

    return deleteService(userId, serviceId)
        .then(result => {
            return res.status(200).json(result);
        })
        .catch(error => {
            logger.warn(error);
            return res.status(400).json(error);
        });
});

router.get("/get-service/:serviceId", (req, res) => {
    const userId = req.user._id;
    const serviceId = req.params.serviceId;

    return getService(userId, serviceId)
        .then(result => {
            return res.status(200).json(result);
        })
        .catch(error => {
            logger.warn(error);
            return res.status(400).json(error);
        });
});

module.exports = router;