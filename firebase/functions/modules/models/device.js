const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const schema = new Schema({
    _id: {type: String, required: true},
    token: {type: String, default: ""},
    createdOn: {type: Date, required: true},
    modifiedOn: {type: Date, required: true},
    deleted: {type: Boolean, default: false, required: true},
    location: {
        type: {type: String, enum: ["Point"], default: "Point"},
        coordinates: {type: [Number], default: [0, 0]},
    },
    createdBy: {type: String, required: true, ref: "Profile"},
    usedBy: {type: String, required: true, ref: "Profile"}
});
schema.index({location: "2dsphere"}, {background: (typeof global.it !== "function")});

module.exports = mongoose.model("Device", schema);