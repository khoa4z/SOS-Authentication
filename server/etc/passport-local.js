/**
 * Created by prasanthv on 14/11/14.
 */
'use strict';

var LocalStrategy = require('passport-local').Strategy,
    User = require('../users/userModel');


module.exports = function(passport) {
    passport.serializeUser(function (user, done) {
        done(null, user.id);
    });

    passport.deserializeUser(function (id, done) {
        User.findById(id, function (err, user) {
            done(err, user);
        });
    });

    passport.use('local', new LocalStrategy(
        function (username, password, done) {
            User.findOne({userName: username}, function (err, user) {
                if (err) {
                    return done(err);
                }
                if (!user) {
                    return done(null, false, {message: 'Incorrect username.'});
                }
                if (!user.verifyPassword(password)) {
                    return done(null, false, {message: 'Incorrect password.'});
                }
                return done(null, user);
            });
        }
    ));
};
//exports.isAuthenticated = passport.authenticate('local', {
//    successRedirect: '/',
//    failureRedirect: '/login'
//});