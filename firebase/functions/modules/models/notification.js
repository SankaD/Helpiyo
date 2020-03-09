const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const schema = new Schema({
    from: {type: String, required: true},
    to: {type: String, required: true, ref: "Profile"},
    type: {
        type: String,
        required: true,
        enum: [
            "complete-request",
            "complete-response",
            "accept-response",
            "reject-response",
            "follow-profile",
            "create-response",
            "award-badge"
        ]
    },
    createdOn: {type: Date, required: true},
    modifiedOn: {type: Date, required: true},
    read: {type: Boolean, default: false, required: true}
});

module.exports = mongoose.model("Notification", schema);