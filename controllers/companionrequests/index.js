/**
 * IoSL-INav controllers/users/compreqs
 * SNET TU Berlin
 * using PIazza code base
 *
 * Companion requests specific controllers
 */


/* Variables and configurations. */

var config = require('./../../config');
var CompanionRequest = require('./../../models/companionrequest');
var User = require('./../../models/user');

var controller = {};



/* Controllers. */

/**
 * This function returns the the pending companionrequests
 * of the currently logged in user.
 */
controller.getPendingRequests = function(req, res, next) {

  CompanionRequest.find({
    to: req.user._id
  }, function(err, allPendingRequest) {

    if (err) {
      console.log("Error during looking for already companion request.");
      console.log(err);
      res.status(500).end();
      return next();
    } else {
      res.json(allPendingRequest);
      return next();
    }
  }).populate('to', '_id name').populate('from', '_id name');
};

/**
 * creates a companion request
 *
 * Parameters:
 * - req.body.userEmail: email of a friend which the user want to send a request
 */
controller.createCompanionRequest = function(req, res, next) {

  /* Save mail address from request body. */
  var companionEmail = req.body.userEmail ? req.body.userEmail : '';

  /* Check if supplied mail address matches a user in the system. */
  User.findOne({
    email: companionEmail
  }, function(err, foundUser) {

    if (err) {
      console.log("Error during checking if supplied mail matches a user in the system.");
      console.log(err);

      res.status(500).end();
      return next();
    }

    /* If there is no matching user, send back a useful message. */
    if (foundUser == null) {

      res.status(400).json({
        status: "failure",
        reason: "no matching user for supplied mail address"
      }).end();
      return next();
    } else {

      /**
       * Check if a companion request has already been made.
       * Check in both directions.
       */
      CompanionRequest.findOne({
        $or: [{
          $and: [{
            from: req.user._id
          }, {
            to: foundUser._id
          }]
        }, {
          $and: [{
            from: foundUser._id
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

        /* A companion request for these both users exists, send success message. */
        if (foundReq) {

          res.status(200).json({
            status: "success",
            reason: "companion request already exists",
            companionRequestID: foundReq._id
          }).end();
          return next();

        } else {

          /* Check if user is already in 'All friends list'. */
          var found = false;
          var g;

          for (g = 0; g < req.user.groups.length; g++) {

            if (req.user.groups[g].name == 'All friends') {

              var mem;

              for (mem = 0; mem < req.user.groups[g].members.length; mem++) {

                if (req.user.groups[g].members[mem]._id == foundUser._id) {
                  found = true;
                  break;
                }
              }
            }
          }

          /**
           * User is already in the 'All friends list'
           */
          if (found) {
            res.status(200).json({
              status: "success",
              reason: "user is already your companion"
            }).end();
            return next();
          } else {

            /**
             * No companion request exists and
             * other user is not already a companion.
             * Create a companion request!
             */
            CompanionRequest.create({
              from: req.user._id,
              to: foundUser._id,
              status: 'pending'
            }, function(err, addedCompanionRequest) {

              if (err) {
                console.log("Error during adding a new companion request.");
                console.log(err);

                res.status(500).end();
                return next();
              }

              /* Send back created request with request ID. */
              res.json({
                status: "success",
                reason: "companion request sent",
                companionRequestID: addedCompanionRequest._id
              });
              return next();
            });
          }
        }
      });
    }
  });
};

/**
 * Gives back a specific companion request.
 *
 * Parameters:
 * - req.companionRequestID: the companionRequestID which should be searched for
 */
controller.getCompanionRequest = function(req, res, next) {

  CompanionRequest.findById(req.companionRequestID, function(err, companionRequest) {

    if (err) {
      console.log("Error during looking for a companion request.");
      console.log(err);
      res.status(500).end();
      return next();
    } else {
      res.json(companionRequest);
      return next();
    }
  }).populate('to', '_id name').populate('from', '_id name');
};

/**
 * Updates a companion request. The companion request could be accepted or denied.
 *
 * Parameters:
 * - req.companionRequestID: the companionRequestID which should be searched for
 * - req.body.accept: accept have to be true if the request should be accepted
 * - req.body.deny: deny have to be true if the request should be denied
 */
controller.updateCompanionRequest = function(req, res, next) {

  if (req.body.accept || req.body.deny) {

    /* search for the companion request */
    CompanionRequest.findById(req.companionRequestID, function(err, companionRequest) {

      if (err) {
        console.log("Error during looking for a companion request.");
        console.log(err);
        res.status(500).end();
        return next();
      }

      /* No companion request found for supplied request ID. */
      if (companionRequest == null) {
        res.status(400).json({
          status: "failure",
          reason: "no matching companion request for supplied companion request ID"
        }).end();
        return next();
      }

      /**
       * if the companion request is denied set the status to denied
       * else check if req.body.accept is set to true, if yes set status of
       * companion request to accepted.
       */
      if (req.body.deny) {

        companionRequest.status = 'denied';
        res.json({
          status: "success",
          reason: "companion request denied"
        });
      } else if (req.body.accept) {

        companionRequest.status = 'accepted';

        User.findById(companionRequest.from, function(err, fromUser) {

          if (err) {
            console.log("Error while locating group of companionrequest");
            console.log(err);
            res.status(500).json();
            return next();
          }

          /**
           * The companion request is accepted and now the companion should be
           * added to the 'All friends list' of the user itself and the user
           * should be added to the 'All friends list' of the companion.
           */
          //TODO: check if already in that group
          var g;
          for (g = 0; g < fromUser.groups.length; g++) {

            if (fromUser.groups[g].name == 'All friends') {
              if (fromUser.groups[g].members.length <= 0) {
                var data = [req.user];
                fromUser.groups[g].members = data;
              } else {
                fromUser.groups[g].members.push(req.user);
              }
            }
          }

          for (g = 0; g < req.user.groups.length; g++) {

            if (req.user.groups[g].name == 'All friends') {
              if (req.user.groups[g].members.length <= 0) {
                var data = [fromUser];
                req.user.groups[g].members = data;
              } else {
                req.user.groups[g].members.push(fromUser);
              }
            }
          }

          req.user.save();
          fromUser.save();
          companionRequest.remove();
          return next();
        });

        res.json({
          status: "success",
          reason: "companion request accepted"
        });
      }

      companionRequest.save();
      return next();
    });
  } else {
    res.status(400).end();
    return next();
  }
};

/**
 * Delete a companion request
 *
 * Parameters:
 * - req.companionRequestID: the companionRequestID which should be deleted
 */
controller.deleteCompanionRequest = function(req, res, next) {

  /* find companion request and delete it */
  CompanionRequest.findByIdAndRemove(req.companionRequestID, function(err, companionRequest) {

    if (err) {
      console.log("Error while removing companion request.");
      res.status(500).end();
      return next();
    }
    res.status(200).json({
      status: "success",
      reason: "companion request deleted"
    });
    return next();
  });
};


/* Export all controllers. */

module.exports = controller;