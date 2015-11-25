// IoSL-INav lists

var express = require('express');

var config = require('./../config');
var controller = require('./../controllers/lists')

var router = express.Router();

router.route('/')
    .get(controller.getAllLists())
    .post(controller.addList());

router.route('/:id')
    .get(controller.getListInfo())
    .put(controller.updateList());

module.exports = router;