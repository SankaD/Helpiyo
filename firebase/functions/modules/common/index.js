const express = require('express');
const logger = require('../utils/logger');
const reportRequest = require('./report_item');
const uploadImages = require('./upload_images');
const deleteImages = require('./delete_images');
const saveFeedback = require('./submit_feedback');
const updateImages = require('./update_images');
const boostItem = require('./boost_item');
const addPointsForShare = require('./add_points_for_share');

const router = express.Router();

router.post("/report/", (req, res) => {
    const userId = req.user._id;
    const elementId = req.body.elementId;
    const comment = req.body.comment;
    const category = req.body.category;
    const elementType = req.body.elementType;

    return reportRequest(userId, elementId, comment, category, elementType)
        .then(result => {
            return res.status(200).json(result);
        })
        .catch(error => {
            logger.warn(error);
            return res.status(400).json(error);
        });
});

router.post("/upload-images", (req, res) => {
    const userId = req.user._id;
    const elementId = req.body.elementId;
    const imagePaths = req.body.imagePaths;
    const elementType = req.body.elementType;

    return uploadImages(userId, elementId, imagePaths, elementType)
        .then(result => {
            return res.status(200).json(result);
        })
        .catch(error => {
            logger.error(error);
            return res.status(400).json(error);
        });
});

router.post("/delete-images", (req, res) => {
    const userId = req.user._id;
    const elementId = req.body.elementId;
    const imagePaths = req.body.imagePaths;
    const elementType = req.body.elementType;

    return deleteImages(userId, elementId, imagePaths, elementType)
        .then(result => {
            return res.status(200).json(result);
        })
        .catch(error => {
            logger.error(error);
            return res.status(400).json(error);
        });
});

router.get("/update-images/:elementType/:elementId", (req, res) => {
    const userId = req.user._id;
    const elementId = req.params.elementId;
    const elementType = req.params.elementType;

    return updateImages(userId, elementType, elementId)
        .then(result => {
            return res.status(200).json(result);
        })
        .catch(error => {
            logger.error(error);
            return res.status(400).json(error);
        });
});

router.post("/new-feedback", (req, res) => {
    const userId = req.user._id;
    const feedback = req.body.feedback;
    return saveFeedback(userId, feedback)
        .then(result => {
            return res.status(200).json(result);
        })
        .catch(error => {
            logger.error(error);
            return res.status(400).json(error);
        });
});

router.get("/boost-item/:elementType/:elementId", (req, res) => {
    const userId = req.user._id;
    const elementType = req.params.elementType;
    const elementId = req.params.elementId;
    return boostItem(userId, elementId, elementType)
        .then(result => {
            return res.status(200).json(result);
        })
        .catch(error => {
            return res.status(400).json(error);
        });
});

router.post("/add-points-for-share", (req, res) => {
    const userId = req.user._id;
    const elementType = req.body.elementType;
    const elementId = req.body.elementId;
    const profileId = req.body.profileId;

    return addPointsForShare(userId, profileId, elementType, elementId)
        .then(result => {
            return res.status(200).json(result);
        })
        .catch(error => {
            return res.status(400).json(error);
        });
});

module.exports = router;
