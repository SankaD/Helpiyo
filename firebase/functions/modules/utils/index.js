const admin = require("firebase-admin");
// const Storage = require("@google-cloud/storage")({keyFilename: "helpiyo-app-31115ba877f0.json"});
const logger = require('./logger');

const Utils = {
    sendInternalError: function (res) {
        res.status(500).json({
            miscError: "system-error"
        });
    },
    createUser: function (id, email, password) {
        const properties = {
            uid: id,
            disabled: false,
            displayName: email,
            email: email,
            emailVerified: false,
            password: password
        };
        return admin.auth().createUser(properties);
    },
    deleteUser: function (uid) {
        return admin.auth().deleteUser(uid);
    },
    getUser: function (uid) {
        return admin.auth().getUser(uid);
    },
    getUserByEmail: function (email) {
        return admin.auth().getUserByEmail(email);
    },
    generateRandomCode: function () {
        return String(Math.floor(Math.random() * 900000) + 100000);
    }
};
module.exports = {
    instance: Utils
};