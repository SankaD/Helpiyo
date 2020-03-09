const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const schema = new Schema({
    createdOn: {type: Date, required: true},
    modifiedOn: {type: Date, required: true},
    deleted: {type: Boolean, default: false},
    from: {type: String, required: true, ref: "Profile"},
    to: {type: String, required: true, index: true},
    targetType: {type: String, enum: ["request", "response", "profile", "service"], required: true},
    comment: {type: String, maxlength: 2000, default: ""},
    category: {type: String, enum: ["racial", "age-inappropriate", "sos-spamming", "other",], required: true}
});

module.exports = mongoose.model("Report", schema);