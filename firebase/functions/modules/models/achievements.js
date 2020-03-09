const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const schema = new Schema({
    createdOn: {type: Date, required: true},
    modifiedOn: {type: Date, required: true},
    deleted: {type: Boolean, default: false},
    expired: {type: Boolean, default: false, required: true},
    expiredOn: {type: Date},
    to: {type: String, required: true, ref: "Profile", index: true},
    from: {type: String, required: true, index: true, ref: "Badge"},
    info: {type: String}
});

module.exports = mongoose.model("Achievement", schema);