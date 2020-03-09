const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const schema = new Schema({
    from: {type: String, required: true, ref: "Profile"},
    to: {type: Schema.Types.ObjectId, required: true, ref: "Request"},
    createdOn: {type: Date, required: true},
    modifiedOn: {type: Date, required: true},
    deleted: {type: Boolean, default: false}
});

module.exports = mongoose.model("Promotion", schema);