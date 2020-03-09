// const Joi = require('joi');
//
// module.exports = Joi.object().keys({
//     _id: Joi.string(),
//     _key: Joi.string(),
// });

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const schema = new Schema({
    threadId: {type: Schema.Types.ObjectId, required: true, ref: "MessageThread"},
    participant: {type: String, ref: "Profile", required: true},
    lastReadOn: {type: Date, required: true},
    lastMessagedOn: {type: Date, required: true}
});

module.exports = mongoose.model("MessageReading", schema);