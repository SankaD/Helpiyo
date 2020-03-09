const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const schema = new Schema({
    createdOn: {type: Date, required: true},
    modifiedOn: {type: Date, required: true},
    deleted: {type: Boolean, default: false},
    from: {type: String, required: true, ref: "Profile"},
    to: {type: Schema.Types.ObjectId, required: true, index: true},
    targetType: {type: String, enum: ["request", "response", "service"], required: true},
    comment: {type: String, maxlength: 1000, required: true},
    commentType: {type: String, enum: ["text"], required: true, default: "text"}
});

module.exports = mongoose.model("Comment", schema);