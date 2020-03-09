// const Joi = require('joi');
//
// module.exports = Joi.object().keys({
//     _id: Joi.string(),
//     _key: Joi.string(),
//     comment: Joi.string().required(),
//     commentType: Joi.string().allow(["image", "text"]).default("text"),
//     createdOn: Joi.date().required(),
//     modifiedOn: Joi.date().required(),
//     deleted: Joi.bool().default(false)
// });


// const Joi = require('joi');
//
// module.exports = Joi.object().keys({
//     _id: Joi.string(),
//     _key: Joi.string(),
// });

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const schema = new Schema({
    createdOn: {type: Date, required: true},
    modifiedOn: {type: Date, required: true},
    deleted: {type: Boolean, default: false},
    createdBy: {type: String, ref: "Profile", required: true},
    feedback: {type: String, maxlength: 2500, required: true},
    read: {type: Boolean, default: false,},
    actioned: {type: Boolean, default: false}
});

module.exports = mongoose.model("Feedback", schema);