const Utils = require('../modules/utils/index');
const mongoose = require('mongoose');

const Profile = require('../modules/models/profile');
const Request = require('../modules/models/request');
const Response = require('../modules/models/response');
const Notification = require('../modules/models/notification');
const Promotion = require('../modules/models/promotion');
const Feedback = require('../modules/models/feedback');
const Comment = require('../modules/models/comments');
const Message = require('../modules/models/message');
const MessageThread = require('../modules/models/message_thread');
const Device = require('../modules/models/device');
const Following = require('../modules/models/follows');
const Report = require('../modules/models/report');

Utils.instance = {
    sendInternalError: function (res) {
        res.status(500).json({error: "Internal server error has occurred"});
    },
    // resetData: function () {
    //     // return mongoose.connection.db.dropDatabase();
    // },
    accountsByUid: [],
    accountsByEmail: [],
    createUser: function (uid, email, password) {
        const data = {email: email, uid: uid};
        this.accountsByUid[uid] = data;
        this.accountsByEmail[email] = data;
        return Promise.resolve(data);
    },
    deleteUser: function (uid) {
        const data = this.accountsByUid[uid];
        delete this.accountsByEmail[data.email];
        delete this.accountsByUid[uid];
        return Promise.resolve(data);
    },
    getUser: function (uid) {
        if (this.accountsByUid[uid]) {
            return Promise.resolve(this.accountsByUid[uid]);
        } else {
            return Promise.reject({code: "auth/user-not-found"});
        }
    },
    getUserByEmail: function (email) {
        if (this.accountsByEmail[email]) {
            return Promise.resolve(this.accountsByEmail[email]);
        } else {
            return Promise.reject({code: "auth/user-not-found"});
        }
    },
    resetData: function () {
        this.accountsByUid = [];
        this.accountsByEmail = [];
        let collections = [
            "profiles",
            "notifications",
            "responses",
            "requests",
            "feedbacks",
            "reports",
            "messages",
            "messagethreads",
            "comments",
            "devices"];


        return mongoose.connection.dropDatabase()
            .then(() => {
                let promises = [
                    Profile.ensureIndexes(),
                    Request.ensureIndexes(),
                    Response.ensureIndexes(),
                    Device.ensureIndexes(),
                    Notification.ensureIndexes(),
                    Promotion.ensureIndexes(),
                    Feedback.ensureIndexes(),
                    Comment.ensureIndexes(),
                    Message.ensureIndexes(),
                    MessageThread.ensureIndexes(),
                    Following.ensureIndexes(),
                    Report.ensureIndexes(),
                ];
                return Promise.all(promises);
            });
    },
    generateRandomCode: function () {
        return "000000";
    }
};

module.exports = Utils;