const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const requestSchema = new Schema({
    post: {type: String, required: true, minlength: 1, maxlength: 2500},
    locationName: {type: String, maxlength: 200},
    location: {
        type: {type: String, enum: ["Point"], default: "Point"},
        coordinates: {type: [Number], default: [0, 0]},
    },
    locationSet: {type: Boolean, default: false, required: true},
    startTime: {type: Date},
    endTime: {type: Date},
    money: {type: Number, min: 0},
    currency: {type: String, minlength: 3, maxlength: 3,},
    createdOn: {type: Date, required: true},
    modifiedOn: {type: Date, required: true},
    status: {type: String, enum: ["draft", "active", "completed"], required: true, default: "draft", index: true},
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
    sos: {type: Boolean, default: false,},
    createdBy: {type: String, required: true, ref: "Profile", index: true},
    requesterRating: {type: Number, min: 0, max: 5},
    requesterComment: {type: String, maxlength: 2000},
    archived: {type: Boolean, default: false, index: true},
    serviceId: {type: mongoose.Schema.Types.ObjectId, ref: "Service"},
    boostedTill: {type: Date},
    boosted: {type: Boolean, default: false,},
    imageRefreshedOn: {type: Date}
});

requestSchema.index({location: "2dsphere"}, {background: (typeof global.it !== "function")});

module.exports = mongoose.model("Request", requestSchema);