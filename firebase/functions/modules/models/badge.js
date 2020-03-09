const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const schema = new Schema({
    _id: {type: String, required: true},
    label: {type: String, required: true, unique: true},
    description: {type: String, required: true},
    imageUrl: {type: String, required: true},
    createdOn: {type: Date, required: true},
    modifiedOn: {type: Date, required: true},
});

module.exports = mongoose.model("Badge", schema);