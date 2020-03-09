const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const schema = new Schema({
    type: {
        type: String,
        required: true,
        enum: [
            "create-request",
            "create-request-sos",
            "create-response",
            "create-response-sos",
            "complete-request",
            "complete-request-sos",
            "complete-response",
            "complete-response-sos",
            "follow-user",
            "unfollow-user",
            "being-followed",
            "being-unfollowed",
            "early-adopter",
            "invites",
            "invited",
            "boost-request",
            "boost-service",
            "daily-usage",
            "continuous-daily-usage", // todo : implement
            "social-share", // added when someone views a shared link
            "promote-request",
            "demote-request",
            "promote-service",
            "demote-service",
            "enable-service",
            "disable-service",
            "keep-request-open", // todo : implement
            "keep-service-open", // todo : implement
        ]
    },
    profileId: {type: String, required: true, ref: "Profile", index: true},
    value: {type: Number, required: true},
    add: {type: Number, default: 0},
    target: {type: String, required: true},
    createdOn: {type: Date, required: true},
});

module.exports = mongoose.model("Point", schema);