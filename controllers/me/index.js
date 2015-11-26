/**
 * IoSL-INav controllers/me/index
 * SNET TU Berlin
 * using PIazza code base
 *
 * Current user specific controllers
 */


/* Variables and configurations. */

var config = require('./../../config');

var User = require('./../../models/user');

var controller = {};


/* Main controller. */

controller.getUserInfo = function getUserInfo(req, res, next) {
    // TODO
    return res.status(501).end();
};


/* Export all controllers. */

module.exports = controller;