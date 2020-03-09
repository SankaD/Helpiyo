const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const requestSchema = new Schema({
    // title: {type: String, required: true, maxlength: 100},
    post: {type: String, required: true, minlength: 1, maxlength: 2500},
    locationName: {type: String, maxlength: 200},
    location: {
        type: {type: String, enum: ["Point"], default: "Point"},
        coordinates: {type: [Number], default: [0, 0]},
    },
    locationSet: {type: Boolean, default: false, required: true},
    money: {type: Number, min: 0},
    currency: {type: String, minlength: 3, maxlength: 3,},
    createdOn: {type: Date, required: true},
    modifiedOn: {type: Date, required: true},
    status: {type: String, enum: ["draft", "active", "inactive"], required: true, default: "draft", index: true},
    banned: {type: Boolean, default: false},
    deleted: {type: Boolean, default: false},
    photos: {
        type: [{
            url: {type: String, required: true},
            filename: {type: String, required: true},
            thumbnail: {type: String}
        }], default: []
    },
    tags: {type: [String]},
    rating: {type: Number, default: 0, required: true},
    createdBy: {type: String, required: true, ref: "Profile", index: true},
    boostedTill: {type: Date},
    boosted: {type: Boolean, default: false,},
    imageRefreshedOn: {type: Date}
});

requestSchema.index({location: "2dsphere"}, {background: (typeof global.it !== "function")});

module.exports = mongoose.model("Service", requestSchema);