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
    from: {type: String, required: true, ref: "Profile", index: true},
    to: {type: String, required: true, ref: "Profile", index: true}
});

module.exports = mongoose.model("Following", schema);