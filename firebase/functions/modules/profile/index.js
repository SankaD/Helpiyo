const express = require('express');
const logger = require('../utils/logger');
const utils = require('../utils');
const createProfile = require('./register');
const getMultiple = require('./get_multiple');
// const getMultipleMeta = require('./get_multiple_meta');
const follow = require('./follow_user');
const unfollow = require('./unfollow_user');
const isFollowing = require('./is_following');
const verifyUser = require('./verify_profile');
const getProfile = require('./get_profile');
const registerDeviceToken = require('./register_device_token');
const getActivity = require('./get_activity');
const changePhoneNumber = require('./change_phone_number');
const verifyPhoneNumber = require('./verify_phone_number');
const updateLocation = require('./update_location');
const getLeaderboard = require('./get_leaderboards');
const uploadProfilePic = require('./upload_profile_pic');
const changeDisplayName = require('./change_display_name');
const setInterests = require('./set_interests');
const getInterests = require('./get_interests');
const getKarmaData = require('./get_karma_data');
const setIntroduced = require('./set_introduced');
const setInitialInvitesDone = require('./initial_invites_done');

const router = express.Router();

router.get('/get/:id', (req, res) => {
    logger.info('getting profile with userId : ', req.params.id, ' for user : ', req.user._id);

    return getProfile(req.user._id, req.params.id)
        .then((result) => {
            return res.status(200).json(result);
        })
        .catch((error) => {
            logger.error(error);
            return res.status(400).json(error);
        });
});

router.post('/get-multiple', (req, res) => {
    return getMultiple(req.user._id, req.body)
        .then(results => {
            return res.status(200).json(results);
        })
        .catch(error => {
            return res.status(400).json(error);
        });
});

router.post('/get-multiple-meta', (req, res) => {
    return getMultipleMeta(req.user._id, req.body)
        .then(results => {
            return res.status(200).json(results);
        })
        .catch(error => {
            return res.status(400).json(error);
        });
});

router.get('/my', (req, res) => {
    let userId = req.user._id;
    logger.info("getting my profile : " + userId);
    return getProfile(userId, userId)
        .then((result) => {
            logger.info("my profile received");
            return res.status(200).json(result);
        })
        .catch((error) => {
            logger.info("my profile not received");
            logger.error(error);
            return res.status(400).json(error);
        });
});

router.post('/create', (req, res) => {
    logger.info('creating profile : ' + req.body.email);
    logger.info(req.body);
    logger.info(req.body.linkData);
    let referrer = req.body.referrer;
    const data = {
        email: req.body.email,
        heroName: req.body.heroName,
        _id: req.body.id,
        referrer: referrer,
    };
    return createProfile(data)
        .then((data) => {
            logger.info('successfully created profile : ' + req.body.email);
            logger.info(data);
            return res.status(200).json(data);
        })
        .catch((error) => {
            logger.error('creating profile failed');
            logger.error(error);
            return res.status(400).json(error);
        });
});

router.delete('/:id', (req, res) => {
    // todo : not supported
    return res.sendStatus(405);
});

router.get('/follow/:id', (req, res) => {
    let currentProfileId = req.user._id;
    let profileId = req.params.id;
    return follow(currentProfileId, profileId)
        .then(result => {
            return res.status(200).json(result);
        })
        .catch(error => {
            logger.warn(error);
            return res.status(400).json(error);
        });
});
router.get('/unfollow/:id', (req, res) => {
    let currentProfileId = req.user._id;
    let profileId = req.params.id;
    return unfollow(currentProfileId, profileId)
        .then(result => {
            return res.status(200).json(result);
        })
        .catch(error => {
            logger.warn(error);
            return res.status(400).json(error);
        });
});

router.get('/is-following/:id', (req, res) => {
    let currentProfileId = req.user._id;
    let profileId = req.params.id;
    return isFollowing(currentProfileId, profileId)
        .then(result => {
            return res.status(200).json(result);
        })
        .catch(error => {
            logger.warn(error);
            return res.status(400).json(error);
        });
});

router.get('/verify/:emailCode/:phoneCode', (req, res) => {
    const userId = req.user._id;
    const emailCode = req.params.emailCode;
    const phoneCode = req.params.phoneCode;
    return verifyUser(userId, emailCode, phoneCode)
        .then((result) => {
            return res.status(200).json(result);
        })
        .catch((error) => {
            logger.error(error);
            return res.status(400).json(error);
        });
});

router.post('/register-device-token', (req, res) => {
    logger.info("registering device token");
    const userId = req.user._id;
    const token = req.body.token;
    const deviceId = req.body.deviceId;

    return registerDeviceToken(userId, token, deviceId)
        .then(result => {
            return res.status(200).json(result);
        })
        .catch(error => {
            return res.status(200).json(error);
        });
});

router.get('/get-activity/:profileId', (req, res) => {
    const userId = req.user._id;
    const profileId = req.params.profileId;
    return getActivity(userId, profileId)
        .then(results => {
            return res.status(200).json(results);
        })
        .catch(error => {
            logger.warn(error);
            return res.status(400).json(error);
        });
});

router.post("/change-phone-number", (req, res) => {
    const userId = req.user._id;
    const phoneNumber = req.body.phoneNumber;
    return changePhoneNumber(userId, phoneNumber)
        .then(result => {
            return res.status(200).json(result);
        })
        .catch(error => {
            logger.warn(error);
            return res.status(400).json(error);
        });
});

router.post("/verify-phone-number", (req, res) => {
    const userId = req.user._id;
    const phoneNumber = req.body.phoneNumber;
    const code = req.body.code;

    return verifyPhoneNumber(userId, phoneNumber, code)
        .then(result => {
            return res.status(200).json(result);
        })
        .catch(error => {
            logger.warn(error);
            return res.status(400).json(error);
        });
});

router.post("/update-location", (req, res) => {
    const userId = req.user._id;
    const deviceToken = req.body.token;
    const latitude = req.body.latitude;
    const longitude = req.body.longitude;

    return updateLocation(userId, deviceToken, latitude, longitude)
        .then(result => {
            return res.status(200).json(result);
        })
        .catch(error => {
            logger.warn(error);
            return res.status(400).json(error);
        });
});

router.get("/leaderboard/:offset/:name", (req, res) => {
    const userId = req.user._id;
    const offset = req.params.offset;
    const name = req.params.name;
    return getLeaderboard(userId, parseInt(offset), name)
        .then(result => {
            return res.status(200).json(result);
        })
        .catch(error => {
            logger.warn(error);
            return res.status(400).json(error);
        });
});

router.post('/upload-profile-pic', (req, res) => {
    const userId = req.user._id;
    const imagePath = req.body.imagePath;
    return uploadProfilePic(userId, imagePath)
        .then(result => {
            return res.status(200).json(result);
        })
        .catch(error => {
            logger.warn(error);
            return res.status(400).json(error);
        });
});

router.post("/change-hero-name", (req, res) => {
    const userId = req.user._id;
    const heroName = req.body.heroName;

    return changeDisplayName(userId, heroName)
        .then(result => {
            return res.status(200).json(result);
        })
        .catch(error => {
            return res.status(400).json(error);
        });
});

router.get("/get-interests", (req, res) => {
    const userId = req.user._id;
    return getInterests(userId)
        .then(result => {
            return res.status(200).json(result);
        })
        .catch(error => {
            return res.status(400).json(error);
        });
});

router.post("/set-interests", (req, res) => {
    const userId = req.user._id;
    const interests = req.body.interests;
    return setInterests(userId, interests)
        .then(result => {
            return res.status(200).json(result);
        })
        .catch(error => {
            return res.status(400).json(error);
        });
});

router.get("/get-karma-data", (req, res) => {
    const userId = req.user._id;
    return getKarmaData(userId)
        .then(result => {
            return res.status(200).json(result);
        })
        .catch(error => {
            return res.status(400).json(error);
        });
});

router.get("/set-introduced", (req, res) => {
    const userId = req.user._id;
    return setIntroduced(userId)
        .then(result => {
            return res.status(200).json(result);
        })
        .catch(error => {
            return res.status(400).json(error);
        });
});

router.get("/set-initial-invites-done", (req, res) => {
    const userId = req.user._id;
    return setInitialInvitesDone(userId)
        .then(result => {
            return res.status(200).json(result);
        })
        .catch(error => {
            return res.status(400).json(error);
        });
});

module.exports = router;