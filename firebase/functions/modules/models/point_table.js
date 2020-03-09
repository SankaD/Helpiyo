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
            "daily-usage", // todo : implement
            "continuous-daily-usage", // todo : implement
            "social-share", // added when someone views a shared link
            "promote-request",
            "demote-request",
            "promote-service",
            "demote-service",
            "enable-service",
            "disable-service",
            "keep-request-open",
            "keep-service-open",
        ]
    },
    value: {type: Number, required: true},
    createdOn: {type: Date, required: true},
    expiredOn: {type: Date},
    status: {type: String, enum: ["active", "inactive"], required: true, default: "active"}
});

module.exports = mongoose.model("PointTable", schema);