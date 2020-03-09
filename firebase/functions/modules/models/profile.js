const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const profileSchema = new Schema({
    _id: {type: String, required: true},
    heroName: {type: String, required: true, trim: true},
    heroNameLower: {type: String, required: true, trim: true, lowercase: true, unique: true},
    createdOn: {type: Date, required: true},
    modifiedOn: {type: Date, required: true},
    status: {type: String, enum: ["new", "active"], default: "new"},
    deactivated: {type: Boolean, default: false, required: true},
    banned: {type: Boolean, default: false, required: true},
    profilePic: {type: String, default: ""},
    defaultCurrency: {
        type: String,
        default: "USD",
        uppercase: true,
        required: true,
        minlength: 3,
        maxlength: 3,
        trim: true
    },
    rating: {type: Number, default: 0, required: true, min: 0, max: 5},
    points: {type: Number, default: 0, required: true},
    absolutePoints: {type: Number, default: 0, required: true, min: 0},
    ranking: {type: Number, default: 10000000, min: 1},
    classRanking: {type: Number, default: 10000000, min: 1},
    classLabel: {type: String, minlength: 1, maxlength: 1, required: true, default: "N"},
    devices: {type: [String]},
    interests: {
        type: [{
            type: String, required: true, maxlength: 20
        }],
        default: [],
        validate: [(val) => val.length <= 10, '{PATH} exceeds the limit of 20']
    },
    imageRefreshedOn: {type: Date},
    introDone: {type: Boolean, default: false},
    initialInvites: {type: Boolean, default: false}
});

// profileSchema.set('toJSON', {virtuals: true});

module.exports = mongoose.model("Profile", profileSchema);