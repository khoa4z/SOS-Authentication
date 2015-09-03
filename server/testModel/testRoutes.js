'use strict';
var mongoose = require('mongoose');
var Test = require('./testModel');
var User = require('../users/userModel');




module.exports = function (router) {
    router.route('/test')
        .get(function (req, res) {
            console.log("get Test");

        })
        .post(function(req, res) {
            console.log("Post Test");
            console.log(req.body);
            //@TODO: Shit getting real
            var _test = new Test({
                food: req.body.food,
                url: req.body.pictureURL
            });
            _test.save(function(err){
                if(err) {
                    console.log(err);
                    res.status(500).send({message:'Unable to save'});
                }
                else {
                    res.send({message: 'Successfully saved'});
                }
            });
        });

    router.route('/test/:itemId')
        .get(function (req, res) {
            Test.findById(req.params.itemId).exec(function(err, market) {
                if (err) {
                    console.log(err);
                    res.status(500).send({message: "Unable to find food post:" + req.params.itemId});
                } else {
                    res.send(market);
                }
            });
        })
        .post(function (req, res) {
            console.log("Post Test");
        })
}