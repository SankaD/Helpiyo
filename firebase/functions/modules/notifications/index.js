const express = require("express");
const logger = require('../utils/logger');

const getNotifications = require('./get_notifications');
const getMessageNotifications = require('./get_message_notifications');
const markNotification = require('./mark_notification_as_read');
const markMessageThread = require('./mark_message_thread_as_read');
const getNotificationCount = require('./get_notification_count');
const getMessageCount = require('./get_message_count');

const router = express.Router();

router.get('/get-notifications', (req, res) => {
    const userId = req.user._id;

    return getNotifications(userId)
        .then(result => {
            return res.status(200).json(result);
        })
        .catch(error => {
            logger.warn(error);
            return res.status(400).json(error);
        });
});

router.get('/get-message-notifications', (req, res) => {
    const userId = req.user._id;
    return getMessageNotifications(userId)
        .then(result => {
            return res.status(200).json(result);
        })
        .catch(error => {
            logger.warn(error);
            return res.status(400).json(error);
        });
});

router.post('/mark-notification', (req, res) => {
    const userId = req.user._id;
    const notificationId = req.body.notificationId;
    return markNotification(userId, notificationId)
        .then(result => {
            return res.status(200).json(result);
        })
        .catch(error => {
            logger.warn(error);
            return res.status(400).json(error);
        });
});

router.post('/mark-message-thread', (req, res) => {
    const userId = req.user._id;
    const threadId = req.body.threadId;
    return markMessageThread(userId, threadId)
        .then(result => {
            return res.status(200).json(result);
        })
        .catch(error => {
            logger.warn(error);
            return res.status(400).json(error);
        });
});

router.get('/get-notification-count', (req, res) => {
    const userId = req.user._id;
    return getNotificationCount(userId)
        .then(result => {
            return res.status(200).json(result);
        })
        .catch(error => {
            logger.warn(error);
            return res.status(400).json(error);
        });
});

router.get('/get-message-count', (req, res) => {
    const userId = req.user._id;
    return getMessageCount(userId)
        .then(result => {
            return res.status(200).json(result);
        })
        .catch(error => {
            logger.warn(error);
            return res.status(400).json(error);
        });
});

module.exports = router;