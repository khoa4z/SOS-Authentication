'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    bcrypt   = require('bcrypt-nodejs');

// Status States
// 0 - Deactivated
// 1 - Active and Authorized
// 2 - Active but Unauthorized

var UserSchema = new Schema({
    userName : {type: String, unique: true, required: true},
    hashedPassword : {type: String, required: true},
    created: {type: Date, default: Date.now },
    modified: {type: Date, default: Date.now },
    firstName : String,
    lastName: String,
    email : String,
    status: {type: Number, default: 2}
});

UserSchema.methods.generateHash = function(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(10), null);
};

UserSchema.methods.verifyPassword = function(password) {
    //console.log('DEBUG',this.hashedPassword);
    return bcrypt.compareSync(password, this.hashedPassword);
};

module.exports = mongoose.model('User', UserSchema);