'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var TestSchema = new Schema({
    food: String,
    pictureURL: String,
    time: {type: Date, default: Date.now}
    //_id: [{type: Schema.Types.ObjectId, ref: "_id"}],
    //user: {type: Schema.Types.ObjectId, ref: "User"}
});

module.exports = mongoose.model('Test', TestSchema);