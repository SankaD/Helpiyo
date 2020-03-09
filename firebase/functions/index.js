const admin = require('firebase-admin');
// const serviceAccount = require('./helpiyo-app-31115ba877f0.json');
const logger = require('./modules/utils/logger');
const functions = require('firebase-functions');
const sgMail = require('@sendgrid/mail');

const mongoose = require('mongoose');
mongoose.set('useCreateIndex', true);
mongoose.set('useFindAndModify', false);
mongoose.Promise = global.Promise;

const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');

const request = require('./modules/requests');
const response = require('./modules/responses');
const event = require('./modules/events');
const feed = require('./modules/feed');
const message = require('./modules/messages');
const thread = require('./modules/threads');
const profile = require('./modules/profile');
const common = require('./modules/common');
const comment = require('./modules/comments');
const wallet = require('./modules/wallets');
const search = require('./modules/search');
const notifications = require('./modules/notifications');
const achievements = require('./modules/achievements');
const services = require('./modules/service');
const invitations = require('./modules/invitations');

// admin.initializeApp({
//     credential: admin.credential.cert(serviceAccount),
//     databaseURL: 'https://helpiyo-app.firebaseio.com',
// });

if (!functions.config().db.mongo_url) {
    logger.error("database url is not defined");
}

sgMail.setApiKey(functions.config().mail.sg_api_key);

const db = mongoose.connection;
db.on("error", (error) => {
    logger.error(error);
});
db.once("open", () => {
    logger.info("mongodb connection opened");
});
db.on("close", () => {
    logger.info('mongodb closed');
});
db.on("reconnect", () => {
    logger.info('mongodb reconnected');
});
db.on("connected", () => {
    logger.info('mongodb connected');
});

let url = functions.config().db.url;
url = url.replace("<password>", functions.config().db.password);
mongoose.connect(url, {
    useNewUrlParser: true,
    dbName: "sakviti",
    keepAlive: true,
    socketTimeoutMS: 540000
});

// If the Node process ends, close the Mongoose connection
process.on('SIGINT', () => {
    logger.info("closing mongoose connection on sigint");
    mongoose.connection.close();
});

const bypassUrlsForToken = ["/status/check"]; // ["/profiles/create", "/profiles/login"];
const validateFirebaseToken = function (req, res, next) {
    // logger.debug('Checking if request is authorized');
    logger.debug(`path :${req.method}: ${req.path}`);
    if (bypassUrlsForToken.includes(req.path.toString())) {
        logger.info('authorizing by-passable request');
        //todo : need more checks. add a cookie here.
        next();
        return;
    }
    if ((!req.headers.customauth ||
        !req.headers.customauth.startsWith('Bearer ')) &&
        !req.cookies.__session) {
        logger.warn('Firebase token or session cookie not found');
        logger.warn(req.headers);
        res.status(403).send('Unauthorized');
        return;
    }
    let idToken;
    if (req.headers.customauth && req.headers.customauth.startsWith('Bearer ')) {
        idToken = req.headers.customauth.split('Bearer ')[1];
    } else {
        idToken = req.cookies.__session;
    }
    admin.auth()
        .verifyIdToken(idToken)
        .then((decodedToken) => {
            req.user = decodedToken;
            req.user._id = req.user.uid;
            logger.debug("userId : " + req.user._id);
            return next();
        })
        .catch((error) => {
            logger.debug("Token : " + idToken);
            logger.error('Error while verifying firebase token : ');
            logger.error(error);
            res.status(403).send('Unauthorized');
        });
};

const bypassUrlsForStatus = ["/status/check"];//["/profiles/create", "/profiles/login"];

const validateUserStatus = (req, res, next) => {
    if (!req.user) {
        next();
        return;
    }
    const userId = req.user.uid;
    if (bypassUrlsForStatus.includes(req.path.toString())) {
        logger.info('authorizing by-passable request');
        next();
        return;
    }
    admin.auth().getUser(userId)
        .then(user => {
            if (user.emailVerified && !user.disabled) {
                return next();
            }
            if (user.disabled) {
                logger.warn("user is disabled");
            } else {
                logger.warn("user email not verified : " + user.email);
            }
            return res.status(403).send("Unauthorized");
        })
        .catch(error => {
            logger.error("couldn't get user for validation");
            logger.error(error);
            return res.status(403).send("Unauthorized");
        });
};

const app = express();

app.use(cors());
app.use(cookieParser());
app.use(bodyParser.json());
app.use(validateFirebaseToken);
app.use(validateUserStatus);

app.use('/requests', request);
app.use('/responses', response);
// app.use('/events', event);
app.use('/feed', feed);
app.use('/messages', message);
app.use('/profiles', profile);
app.use('/common', common);
app.use('/threads', thread);
app.use('/comments', comment);
app.use('/wallet', wallet);
app.use('/search', search);
app.use('/notifications', notifications);
app.use("/achievements", achievements);
app.use("/services", services);
app.use("/invitations", invitations);

const ProfileModel = require('./modules/models/profile');
app.get('/status/check', (req, res) => {
    logger.info("status check");
    return ProfileModel.findOne({heroName: "Helpiyo"}).exec()
        .then(() => {
            logger.info("status check : passed");
            return res.sendStatus(200);
        })
        .catch(error => {
            logger.info("status check : failed");
            logger.error(error);
            return res.sendStatus(400);
        });
});

exports.api = functions.region("europe-west1")
    .runWith({timeoutSeconds: 60, memory: "512MB"})
    .https
    .onRequest(app);

const calculateRankings = require('./modules/batch/calculate_rankings');
const checkBadges = require('./modules/achievements/check_badges');
const calculateEarlyAdopters = require('./modules/achievements/award_early_adopter');
const awardTopHero = require('./modules/achievements/award_top_hero');
const archiveRequests = require('./modules/batch/archive_requests');
const updateImageLinks = require('./modules/batch/update_image_links');
const completeOldSos = require('./modules/batch/complete-old-sos');

exports.archive_requests = functions.region("europe-west1")
    .runWith({timeoutSeconds: 540})
    .pubsub.topic('archive-requests')
    .onPublish(() => {
        return archiveRequests();
    });

exports.calculate_rankings = functions.region("europe-west1")
    .runWith({timeoutSeconds: 540})
    .pubsub.topic('calculate-rankings')
    .onPublish((event) => {
        logger.info("calculate-rankings");
        return calculateRankings()
            .then(() => {
                return checkBadges();
            });
    });
exports.award_early_adopters = functions.region("europe-west1")
    .runWith({timeoutSeconds: 540, memory: "1GB"})
    .pubsub.topic('calculate-early-adopter')
    .onPublish((event) => {
        logger.info("calculate-early-adopter");
        return calculateEarlyAdopters();
    });
exports.award_top_hero = functions.region("europe-west1")
    .runWith({timeoutSeconds: 540})
    .pubsub.topic('calculate-top-hero')
    .onPublish((event) => {
        logger.info("calculate-top-hero");
        return awardTopHero();
    });
exports.updateImageLinks = functions.region("europe-west1")
    .runWith({timeoutSeconds: 540})
    .pubsub.topic('update-image-links')
    .onPublish((event) => {
        logger.info("update-image-links");
        return updateImageLinks();
    });

exports.completeOldSos = functions.region("europe-west1")
    .runWith({timeoutSeconds: 540})
    .pubsub.topic('complete-old-sos')
    .onPublish((event) => {
        logger.info("complete-old-sos");
        return completeOldSos();
    });