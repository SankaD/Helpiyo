// const Joi = require('joi');
//
// module.exports = Joi.object().keys({
//     _id: Joi.string(),
//     _key: Joi.string(),
// });

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const schema = new Schema({
    name: {type: String, required: false, maxlength: 30},
    createdOn: {type: Date, required: true},
    modifiedOn: {type: Date, required: true},
    banned: {type: Boolean, default: false},
    deletedBy: {type: [{type: String, ref: "Profile"}], default: []},
    readBy: {type: [{type: String, ref: "Profile"}], default: []},
    createdBy: {type: String, required: true, ref: "Profile"},
    participants: {type: [{type: String, required: true, ref: "Profile"}], required: true, default: []},
});

module.exports = mongoose.model("MessageThread", schema);