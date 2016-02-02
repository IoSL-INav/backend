/**
 * IoSL-INav middleware/authenticate-test
 * SNET TU Berlin
 * using PIazza code base
 *
 * Dummy authentication middleware to allow
 * automatic testing of the API.
 */

var User = require('../models/user');
var userController = require('../controllers/users');


/**
 * Insert a dummy user for testing purposes.
 * Other than that we simply need to satisfy an
 * authentication function.
 */
var findOrCreateUser = function(req, res, next) {

  /* Dummy values. */
  var userID = "ee000000-1234-abcd-def71-83a736f72941";
  var name = "Mark.Smith";
  var email = "mark.smith@web.org";

  /* Try to find the user by supplied ID. */
  User.findById(userID, function(err, user) {

    if (err) {
      console.log("Error while locating model for userID: %s.", userID);
      console.log(err);
      res.status(500).json();
      return next();
    }

    /* No user found - create one. */
    if (user == null) {

      User.create({
        _id: userID,
        name: name,
        email: email,
        groups: [{
          name: 'All friends',
          members: []
        }]
      }, function(err, user) {

        if (err) {
          console.log("Could not login user with ID: %s.", userID);
          console.log(err);
          res.status(500).json();
          return next();
        }

        /* Add user object to request structure. */
        req.user = user;
        return next();
      });
    } else {

      /* Hotfix for mail retrieving problem. */
      user.email = email;
      user.save();
      req.user = user;
      return next();
    }
  }).populate('groups.members', 'name _id');
};


/* Export only above function. */
module.exports = function(keycloak) {
  return findOrCreateUser;
};