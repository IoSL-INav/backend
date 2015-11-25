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

controller.getAllLists = function getAllLists(req, res, next) {
    return res.status(501).end();
};

controller.addList = function addList(req, res, next) {
    return res.status(501).end();
};

controller.getListInfo = function getListInfo(req, res, next) {
    return res.status(501).end();
};

controller.updateList = function updateList(req, res, next) {
    return res.status(501).end();
};

controller.deleteList = function deleteList(req, res, next) {
    return res.status(501).end();
};

controller.addUserToList = function addUserToList(req, res, next) {
    return res.status(501).end();
};

controller.removeUserFromList = function removeUserFromList(req, res, next) {
    return res.status(501).end();
};


/* Export all controllers. */

module.exports = controller;