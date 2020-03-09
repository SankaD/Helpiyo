// const Joi = require('joi');
//
// module.exports = Joi.object().keys({
//     _id: Joi.string(),
//     _key: Joi.string(),
// });

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const schema = new Schema({
    message: {type: String, required: true, minlength: 1, maxlength: 2000},
    createdOn: {type: Date, required: true},
    modifiedOn: {type: Date, required: true},
    banned: {type: Boolean, default: false},
    deletedBy: {type: [{type: String, ref: "Profile"}], default: []},
    readBy: {type: [{type: String, ref: "Profile"}], default: []},
    createdBy: {type: String, required: true, ref: "Profile", index: true},
    threadId: {type: Schema.Types.ObjectId, required: true, ref: "MessageThread", index: true}
});

module.exports = mongoose.model("Message", schema);