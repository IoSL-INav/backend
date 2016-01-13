/**
 * IoSL-INav controllers/users/compreqs
 * SNET TU Berlin
 * using PIazza code base
 *
 * Companion requests specific controllers
 */


/* Variables and configurations. */

var config = require('./../../config');
var CompanionRequest = require('./../../models/compreq');
var User = require('./../../models/user');

var controller = {};



/* Controllers. */


controller.getPendingRequests = function(req, res, next) {
    CompanionRequest.find({to:req.user._id},function(err,allPendingRequest){
      if (err) {
          console.log("Error during looking for already companion request.");
          console.log(err);

          res.status(500).end();
          return next();
      }else{
        res.json(allPendingRequest);
        return next();
      }
    });
};


controller.createCompanionRequest = function(req, res, next) {

    var companionID = req.body.userID;

    CompanionRequest.findOne({
        $or: [{
            $and: [{
                from: req.user._id
            }, {
                to: companionID
            }]
        }, {
            $and: [{
                from: companionID
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

        if(foundReq){

          res.status(200).json({
            status: "success",
            reason: "companion request already exists",
            CompanionRequestID: foundReq._id
          }).end();
          return next();
        }else{
          User.findById(companionID, function(err, foundUser) {

            if (err) {
              console.log("During a companion request, the other user could not be found.");
              console.log(err);

              res.status(500).end();
              return next();
            }

            CompanionRequest.create({
              from: req.user._id,
              to: companionID,
              status: 'pending'
            }, function(err, addedCompanionRequest) {

              if (err) {
                console.log("Error during adding a new companion request.");
                console.log(err);

                res.status(500).end();
                return next();
              }

              res.json({
                status: "success",
                reason: "companion request sent",
                CompanionRequestID: addedCompanionRequest._id
              });
              return next();
            });
          });
        }
    });
};



/* Export all controllers. */

module.exports = controller;
