'use strict';

var User = require('./userModel'),
    mongoose = require('mongoose'),
    Q = require('q'),
    _ = require('lodash'),
    findUser = Q.nbind(User.find, User);

module.exports = function (router) {
    router.route('/user')
        .get(function (req, res) {
            User.find().exec(function (err, users) {
                res.json(users);
            });
        })
        .post(function (req, res) {
            //@TODO Verify the username or email doesn't already exist
            //@TODO Verify body contains required parameters
            //doesUserExist(req.body.username, req.body.email);
            var tasks = [];
            var user = new User();
            console.log(req.body);
            user.userName = req.body.userName;
            user.email = req.body.email;
            user.hashedPassword = user.generateHash(req.body.password1);
            user.firstName = req.body.firstName;
            user.lastName = req.body.lastName;
            user.auth = false;

            Q.all(tasks)
                .then(function (results) {
                    user.save(function (err) {
                        if (err) {
                            res.status(417).send(err);
                            console.log(err);
                        }
                        else {
                            console.log('Sonic!');
                            res.send({message: 'User Created'});
                        }
                    });
                }, function (err) {
                    console.log(err);
                    res.status(417).send(err);
                });
        });

    router.route('/user/:id')
        .get(function (req, res) {
            // Wrapped with promise
            //findUser({_id: new mongoose.Types.ObjectId(req.params.id)})
            //    .done(function (user) {
            //        res.json(user);
            //    }, function (err) {
            //        console.log('User not found');
            //        res.status(200).send();
            //    });
            //@TODO Should also populate Answers, Questions, favs,
            User.find({_id: new mongoose.Types.ObjectId(req.params.id)})
                //.populate([{path: 'program', select: 'name programCode'},
                //    {path: 'subscribed', select: 'name courseCode'},
                //    {path: 'enrolled', select: 'name courseCode'}
                //])
                .exec(function (err, user) {
                    if (err) res.send(err);
                    res.json(user);
                }
            );
        });

    router.route('/user/:id/subscribed')
        .get(function (req, res) {
            User.findOne({_id: new mongoose.Types.ObjectId(req.params.id)}, 'subscribed')
                .populate([{path: 'subscribed', select: 'name courseCode'}])
                .exec(function (err, user) {
                    if (err) res.send(err);
                    res.json(user.subscribed);
                }
            );
        });

    //Get all market posts by user
    router.route('/user/market/:user_id')
        .get(function (req, res) {
            User.findById(req.params.user_id).populate('marketPosts').exec(function (err, user) {
                if (err) {
                    res.send(err);
                }
                res.json({message: user});
            });
        });

    //Get all conversations by user
    router.route('/user/conversations/:user_id')
        .get(function (req, res) {
            User.findById(req.params.user_id).populate('conversations').exec(function (err, user) {
                if (err) {
                    res.send(err);
                }
                res.json({message: user});
            });
        });


    //Get all questions created by a user
    router.route('/user/questions/:user_id')
        .get(function (req, res) {
            User.findById(req.params.user_id).populate('questions').exec(function (err, user) {
                if (err) {
                    res.send(err);
                }
                res.json({message: user});
            });
        });

    //Deactivate user
    router.route('/user/deactivate/')
        .post(function (req, res) {
            User.findById(req.body.user).exec(function (err, user) {
                if (err) {
                    console.log(err);
                }

                user.status = 0;
                user.save(function (err) {
                    if (err) {
                        console.log(err);
                    }
                });
            })
        });

    //Get all favourites by user
    router.route('/user/favourites/:userid')
        .get(function (req, res) {
            User.findById(req.params.userid).populate('favourites').exec(function (err, user) {
                if (err) {
                    res.send(err);
                }
                res.json(user.favourites);
            });
        });

    // Add/remove Favourites
    router.route('/user/favourites/:userid/:id')
        .put(function (req, res) {
            console.log('DEBUG: Recieved', req.params);
            var _fav = new mongoose.Types.ObjectId(req.params.id);
            var _user = new mongoose.Types.ObjectId(req.params.userid);

            User.findById(_user, function (err, user) {
                if (err) {
                    console.log(err);
                    res.status(217).json({message: 'Error finding user', user: _user, err: err});
                }

                if (user.favourites.indexOf(_fav) < 0) {
                    console.log('Favoured');
                    user.favourites.push(_fav);
                    user.save(function (err) {
                        if (err) {
                            console.log(err);
                            res.status(217).json({message: 'Error saving user', user: _user, fav: _fav, err: err});
                        }
                        res.json(user.favourites);
                    })
                } else {
                    console.log('Unfavoured');
                    user.favourites.splice(user.favourites.indexOf(_fav),1);
                    user.save(function (err) {
                        if (err) {
                            console.log(err);
                            res.status(217).json({message: 'Error saving user', user: _user, fav: _fav, err: err});
                        }
                        res.json(user.favourites);
                    });
                }
            });

        });
};

function doesUserExist(username, email) {
    //@TODO Needs to return a promise
    User.count({$or: [{userName: username}, {email: email}]}, function (err, data) {
        console.log('data', data !== 0);
        return data !== 0;
    });
}