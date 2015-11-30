/**
 * IoSL-INav controllers/lists/index
 * SNET TU Berlin
 * using PIazza code base
 *
 * Lists specific controllers
 */


/* Variables and configurations. */

var config = require('./../../config');

var List = require('./../../models/list');
var User = require('./../../models/user');

var controller = {};


/* Controllers concerning lists. */

controller.getAllLists = function (req, res, next) {
    return res.status(501).end();
};

controller.addList = function (req, res, next) {
    return res.status(501).end();
};

controller.getListInfo = function (req, res, next) {
    return res.status(501).end();
};

controller.updateList = function (req, res, next) {
    return res.status(501).end();
};

controller.deleteList = function (req, res, next) {
    return res.status(501).end();
};

controller.addUserToList = function (req, res, next) {
    return res.status(501).end();
};

controller.removeUserFromList = function (req, res, next) {
    return res.status(501).end();
};


/* Export all controllers. */

module.exports = controller;