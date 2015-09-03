'use strict';
var mongoose = require('mongoose'),
    User = require('../users/userModel'),
    Q = require('q');

module.exports = function (router, local, jwt) {
    console.log("LoginRoutes");
    router.post('/login', local, function (req, res) {
        console.log("in Login- Server");
        //@TODO Only needs count of questions, comments, answers
        User.findById({_id: req.user._id}, 'userName firstName lastName email')
            //.populate([{path: 'program', select: 'name programCode'}])
            .exec(function (err, user) {
                if (err) res.status(417).send(err);
                //@TODO Make token much stronger!
                var token = jwt.sign(user, 'secret', {expiresInMinutes: 60 * 5});
                console.log('DEBUG: Generated token');
                res.send({
                    token: token,
                    user: user
                });
            });
    });

    router.get('/logout', function (req, res) {
        req.logOut();
        res.sendStatus(200);
    });


    //@TODO This USER POST should be somewhere else!
    router.route('/user')
        .post(function (req, res) {
            //@TODO Verify the username or email doesn't already exist
            //@TODO Verify body contains required parameters
            //doesUserExist(req.body.username, req.body.email);
            console.log(req.body);
            var tasks = [];
            var user = new User();
            user.userName = req.body.userName;
            user.email = req.body.email;
            console.log("This is the password: "+ req.body.password1);
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
                            console.log('User is well created!');
                            res.send({message: 'User Created'});
                        }
                    });
                }, function (err) {
                    console.log(err);
                    res.status(417).send(err);
                });
        });
};