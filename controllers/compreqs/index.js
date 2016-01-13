/**
 * IoSL-INav controllers/users/compreqs
 * SNET TU Berlin
 * using PIazza code base
 *
 * Companion requests specific controllers
 */


/* Variables and configurations. */

var config = require('./../../config');
var CompReq = require('./../../models/compreq');
var User = require('./../../models/user');

var controller = {};



/* Controllers. */


controller.getPendingRequests = function(req, res, next) {
    return res.status(501).end();
};


controller.addCompRequest = function(req, res, next) {

    var addCompID = req.body.userID;

    CompReq.findOne({
        $or: [{
            $and: [{
                from: req.user._id
            }, {
                to: addCompID
            }]
        }, {
            $and: [{
                from: addCompID
            }, {
                to: req.user._id
            }]
        }]
    }, function(err, foundReq) {

        if (err) {
            console.log("Error during looking for already existing companion request.");
            console.log(err);

            res.status(500).end();
            return next();
        }

        User.findById(addCompID, function(err, foundUser) {

            if (err) {
                console.log("During a companion request, the other user could not be found.");
                console.log(err);

                res.status(500).end();
                return next();
            }

            CompReq.create({
                from: req.user._id,
                to: addCompID,
                status: 'pending'
            }, function(err, addedCompReq) {

                if (err) {
                    console.log("Error during adding a new companion request.");
                    console.log(err);

                    res.status(500).end();
                    return next();
                }

                res.json({
                    status: "success",
                    reason: "companion request sent",
                    compReqID: addedCompReq._id
                });
                return next();
            });
        });
    });
};



/* Export all controllers. */

module.exports = controller;