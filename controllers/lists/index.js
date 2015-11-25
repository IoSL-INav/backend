// IoSL-INav lists api controller

var util = require('./../../util');
var isErrorOrNull = util.isErrorOrNull;

var config = require('./../../config');
var list = require('./../../models/list');

var controller = {};

controller.getAllLists = function getAllLists(req, res, next) {
	// TODO
	return res.status(501).end();
};

controller.addList = function addList(req, res, next) {
  // TODO
  return res.status(501).end();
};

controller.getListInfo = function getListInfo(req, res, next) {
  //TODO
  return res.status(501).end();
};

controller.updateList = function updateList(req, res, next) {
	//TODO
  return res.status(501).end();
};

module.exports = controller;
