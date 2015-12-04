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
        hello: "World",
        username: req.user.name,
        userId: req.user._id
    });
}


/* Export all controllers. */

module.exports = controller;