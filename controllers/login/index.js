/**
 * IoSL-INav controllers/login/index
 * SNET TU Berlin
 * using PIazza code base
 *
 * Login specific controllers
 */


/* Variables and configurations. */

var controller = {};


/* Controllers. */

controller.login = function(req, res, next) {

    return res.json({
        status: "success",
        userID: req.user._id,
        username: req.user.name
    });
}


/* Export all controllers. */

module.exports = controller;